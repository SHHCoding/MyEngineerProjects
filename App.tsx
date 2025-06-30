import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Project, Step } from './types';
import { ProjectStatus } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import FilterControls from './components/FilterControls';
import ConfirmationModal from './components/ConfirmationModal';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    time: '',
    owner: '',
    designer: '',
  });

  const [theme, setTheme] = useTheme();
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'status'> | Project) => {
    let isEditing = false;
    
    if ('id' in projectData) {
      isEditing = true;
      const updatedProject = { ...projectToEdit, ...projectData } as Project;
      
      const totalSteps = updatedProject.steps.length;
      const completedSteps = updatedProject.steps.filter(s => s.completed).length;

      // Recalculate status for projects with steps, but respect the NotStarted state.
      if (totalSteps > 0 && updatedProject.status !== ProjectStatus.NotStarted) {
        if (completedSteps === totalSteps) {
          updatedProject.status = ProjectStatus.Done;
          if (!updatedProject.endDate) {
            updatedProject.endDate = new Date().toISOString();
          }
        } else {
          updatedProject.status = ProjectStatus.InProgress;
          updatedProject.endDate = undefined; // A project can't be finished if steps are incomplete
        }
      }
      // If totalSteps is 0, status is manual.
      // If status is NotStarted, it remains so until user clicks Start.
      // No explicit 'else' needed as the original status is preserved from projectToEdit.
      
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    } else {
      const newProject: Project = {
        ...(projectData as Omit<Project, 'id' | 'status'>),
        id: new Date().toISOString(),
        status: ProjectStatus.NotStarted,
        steps: projectData.steps || [],
      };
      setProjects(prev => [newProject, ...prev]);
    }
    closeForm();
    setToast({ message: isEditing ? 'គម្រោងត្រូវបានធ្វើបច្ចុប្បន្នភាព!' : 'គម្រោងត្រូវបានបង្កើតដោយជោគជ័យ!', type: 'success' });
  };

  const handleEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsFormOpen(true);
  };

  const handleDelete = useCallback(() => {
    if (projectToDelete) {
      setProjects(prev => prev.filter(p => p.id !== projectToDelete));
      setProjectToDelete(null);
      setToast({ message: 'គម្រោងត្រូវបានលុប។', type: 'success' });
    }
  }, [projectToDelete, setProjects]);

  const handleStartWork = (projectId: string) => {
    setProjects(prev => prev.map(p => 
        p.id === projectId 
        ? {
            ...p,
            status: ProjectStatus.InProgress,
            startDate: new Date().toISOString(),
          } 
        : p
    ));
    setToast({ message: 'ការងារគម្រោងបានចាប់ផ្តើម។', type: 'success' });
  };

  const handleFinishWork = (projectId: string) => {
      setProjects(prev => prev.map(p => 
          p.id === projectId 
          ? {
              ...p,
              status: ProjectStatus.Done,
              endDate: new Date().toISOString(),
            } 
          : p
      ));
      setToast({ message: 'គម្រោងត្រូវបានសម្គាល់ថាបានបញ្ចប់។', type: 'success' });
  };

  const handleToggleStep = (projectId: string, stepId: string) => {
    setProjects(prev => prev.map(p => {
        if (p.id !== projectId) {
            return p;
        }

        const newSteps = p.steps.map(step => {
            if (step.id !== stepId) {
                return step;
            }
            const isNowCompleted = !step.completed;
            return {
                ...step,
                completed: isNowCompleted,
                completedAt: isNowCompleted ? new Date().toISOString() : undefined,
            };
        });

        const totalSteps = newSteps.length;
        const completedSteps = newSteps.filter(s => s.completed).length;

        let newStatus = p.status;
        let newEndDate = p.endDate;

        // Only auto-update status between InProgress and Done for projects with steps.
        // Will not auto-start a project.
        if (p.status !== ProjectStatus.NotStarted && totalSteps > 0) {
            if (completedSteps === totalSteps) {
                newStatus = ProjectStatus.Done;
                if (!p.endDate) { 
                    newEndDate = new Date().toISOString();
                }
            } else {
                // If any step is incomplete, it's InProgress.
                newStatus = ProjectStatus.InProgress;
                newEndDate = undefined; // It can't be 'Done' so remove end date.
            }
        }
        
        return {
            ...p,
            steps: newSteps,
            status: newStatus,
            endDate: newEndDate,
        };
    }));
  };
  
  const handleAddStepToProject = (projectId: string, stepName: string) => {
    setProjects(prevProjects => prevProjects.map(p => {
        if (p.id !== projectId) {
            return p;
        }

        const newStep: Step = {
            id: `${new Date().getTime()}`,
            name: stepName,
            completed: false,
        };

        const newSteps = [...p.steps, newStep];
        
        let newStatus = p.status;
        let newEndDate = p.endDate;

        // If a step is added to a 'Done' project, it should become 'In Progress' again.
        if (p.status === ProjectStatus.Done) {
            newStatus = ProjectStatus.InProgress;
            newEndDate = undefined;
        }

        return {
            ...p,
            steps: newSteps,
            status: newStatus,
            endDate: newEndDate,
        };
    }));
    setToast({ message: 'ជំហានត្រូវបានបន្ថែមដោយជោគជ័យ។', type: 'success' });
  };


  const closeForm = () => {
    setIsFormOpen(false);
    setProjectToEdit(null);
  };

  const handleFilterChange = <K extends keyof typeof filters>(filter: K, value: string) => {
    setFilters(prev => ({...prev, [filter]: value}));
  };

  const handleExport = () => {
    if (projects.length === 0) {
      setToast({ message: 'មិនមានទិន្នន័យដើម្បីនាំចេញទេ។', type: 'error' });
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(projects, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `engipro_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setToast({ message: 'ទិន្នន័យត្រូវបាននាំចេញដោយជោគជ័យ។', type: 'success' });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
    if(event.target) {
        event.target.value = '';
    }
  };

  const confirmImport = () => {
    if (!importFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File could not be read.");
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          // Data validation could be added here
          setProjects(data);
          setToast({ message: 'ទិន្នន័យត្រូវបាននាំចូលដោយជោគជ័យ។', type: 'success' });
        } else {
          throw new Error("Invalid data format.");
        }
      } catch (err) {
        console.error("Import error:", err);
        setToast({ message: 'ការនាំចូលបានបរាជ័យ។ សូមពិនិត្យមើលឯកសារ។', type: 'error' });
      } finally {
        setImportFile(null);
      }
    };
    reader.onerror = () => {
      setToast({ message: 'Error reading file.', type: 'error' });
      setImportFile(null);
    };
    reader.readAsText(importFile);
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(p => filters.status ? p.status === filters.status : true)
      .filter(p => filters.owner ? p.owner === filters.owner : true)
      .filter(p => filters.designer ? p.designer === filters.designer : true)
      .filter(p => {
        if (!filters.time) return true;
        if (!p.deadline) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadline = new Date(`${p.deadline}T00:00:00`);
        switch (filters.time) {
          case 'week': {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return deadline >= startOfWeek && deadline <= endOfWeek;
          }
          case 'month':
            return deadline.getMonth() === today.getMonth() && deadline.getFullYear() === today.getFullYear();
          case 'year':
            return deadline.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      });
  }, [projects, searchTerm, filters]);

  const owners = useMemo(() => [...new Set(projects.map(p => p.owner).filter(Boolean))], [projects]);
  const designers = useMemo(() => [...new Set(projects.map(p => p.designer).filter(Boolean))], [projects]) as string[];

  return (
    <div className="flex flex-col h-full">
      <Header theme={theme} onThemeChange={setTheme} />
      <main className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-grow overflow-y-auto">
        <Dashboard projects={projects}/>
        <FilterControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
            owners={owners}
            designers={designers}
            onAddProject={() => setIsFormOpen(true)}
            onImport={handleImportClick}
            onExport={handleExport}
        />
        <ProjectList
          projects={filteredProjects}
          onEdit={handleEdit}
          onDelete={(id) => setProjectToDelete(id)}
          onToggleStep={handleToggleStep}
          onStartWork={handleStartWork}
          onFinishWork={handleFinishWork}
          onAddStep={handleAddStepToProject}
        />
      </main>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
        aria-hidden="true"
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <ProjectForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
      />

       <ConfirmationModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDelete}
        title="បញ្ជាក់ការលុប"
        message="តើអ្នកពិតជាចង់លុបគម្រោងនេះមែនទេ? សកម្មភាពនេះមិនអាចមិនធ្វើវិញបានទេ។"
        confirmButtonText="បញ្ជាក់​ការ​លុប"
      />

      <ConfirmationModal
        isOpen={!!importFile}
        onClose={() => setImportFile(null)}
        onConfirm={confirmImport}
        title="បញ្ជាក់ការនាំចូល"
        message="តើអ្នកពិតជាចង់នាំចូលទិន្នន័យមែនទេ? សកម្មភាពនេះនឹងសរសេរជាន់លើទិន្នន័យគម្រោងបច្ចុប្បន្នទាំងអស់។"
        confirmButtonText="បញ្ជាក់ការនាំចូល"
      />
    </div>
  );
};

export default App;