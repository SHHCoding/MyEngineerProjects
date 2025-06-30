import React from 'react';
import type { Project } from '../types';
import ProjectItem from './ProjectItem';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onToggleStep: (projectId: string, stepId: string) => void;
  onStartWork: (id: string) => void;
  onFinishWork: (id: string) => void;
  onAddStep: (projectId: string, stepName: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, ...props }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
           <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 dark:text-indigo-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white font-display">មិនមានគម្រោងត្រូវគ្នានឹងតម្រងទេ</h3>
        <p className="mt-2 text-base text-slate-500 dark:text-slate-400">សូមព្យាយាមលៃតម្រូវការស្វែងរក ឬតម្រងរបស់អ្នក, ឬបន្ថែមគម្រោងថ្មី។</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectItem key={project.id} project={project} {...props} />
      ))}
    </div>
  );
};

export default ProjectList;