import React, { useState, useEffect } from 'react';
import type { Project, Step } from '../types';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id' | 'status'> | Project) => void;
  projectToEdit: Project | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ isOpen, onClose, onSave, projectToEdit }) => {
  const [projectData, setProjectData] = useState({
    name: '',
    location: '',
    owner: '',
    designer: '',
    deadline: '',
  });
  const [steps, setSteps] = useState<(Omit<Step, 'id'>)[]>([]);
  const [stepName, setStepName] = useState('');


  useEffect(() => {
    if (projectToEdit) {
      setProjectData({
        name: projectToEdit.name,
        location: projectToEdit.location,
        owner: projectToEdit.owner,
        designer: projectToEdit.designer || '',
        deadline: projectToEdit.deadline ? projectToEdit.deadline.split('T')[0] : '', // Format for date input
      });
      setSteps(projectToEdit.steps || []);
    } else {
      setProjectData({
        name: '',
        location: '',
        owner: '',
        designer: '',
        deadline: '',
      });
      setSteps([]);
    }
    setStepName('');
  }, [projectToEdit, isOpen]);
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
          onClose();
       }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStep = () => {
    if (stepName.trim()) {
      setSteps(prev => [...prev, { name: stepName.trim(), completed: false }]);
      setStepName('');
    }
  };

  const handleRemoveStep = (indexToRemove: number) => {
    setSteps(prev => prev.filter((_, index) => index !== indexToRemove));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSteps = steps.map((s, i) => ('id' in s ? s : { ...s, id: `${new Date().getTime()}-${i}` })) as Step[];
    onSave(projectToEdit ? { ...projectToEdit, ...projectData, steps: finalSteps } : { ...projectData, steps: finalSteps });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white font-display">
          {projectToEdit ? 'កែសម្រួលគម្រោង' : 'បន្ថែមគម្រោងថ្មី'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">ឈ្មោះគម្រោង</label>
              <input type="text" name="name" id="name" value={projectData.name} onChange={handleChange} required className="w-full px-4 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
            </div>
            <div className="space-y-1">
              <label htmlFor="location" className="text-sm font-medium text-slate-700 dark:text-slate-300">ទីតាំង</label>
              <input type="text" name="location" id="location" value={projectData.location} onChange={handleChange} required className="w-full px-4 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
            </div>
            <div className="space-y-1">
              <label htmlFor="owner" className="text-sm font-medium text-slate-700 dark:text-slate-300">ម្ចាស់គម្រោង</label>
              <input type="text" name="owner" id="owner" value={projectData.owner} onChange={handleChange} required className="w-full px-4 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
            </div>
            <div className="space-y-1">
              <label htmlFor="designer" className="text-sm font-medium text-slate-700 dark:text-slate-300">វិស្វករ​រចនា</label>
              <input type="text" name="designer" id="designer" value={projectData.designer} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <label htmlFor="deadline" className="text-sm font-medium text-slate-700 dark:text-slate-300">កាលបរិច្ឆេទ​កំណត់</label>
            <input type="date" name="deadline" id="deadline" value={projectData.deadline} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
          </div>

          <div className="mt-6">
            <label htmlFor="step-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">ជំហានការងារ</label>
            <div className="flex gap-2 mt-1">
              <input 
                type="text" 
                id="step-name"
                value={stepName} 
                onChange={e => setStepName(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddStep())}
                placeholder="ឧទាហរណ៍៖ ការងារគ្រឹះ"
                className="flex-grow px-4 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <button type="button" onClick={handleAddStep} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900 font-semibold text-sm transition">បន្ថែម</button>
            </div>
             {steps.length > 0 && (
                <ul className="mt-3 space-y-2 max-h-32 overflow-y-auto pr-2">
                  {steps.map((step, index) => (
                    <li key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-2 rounded-md">
                      <span className="text-sm text-slate-800 dark:text-slate-200">{step.name}</span>
                      <button type="button" onClick={() => handleRemoveStep(index)} className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition" aria-label="Remove step">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold text-sm transition">បោះបង់</button>
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">រក្សាទុក</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
