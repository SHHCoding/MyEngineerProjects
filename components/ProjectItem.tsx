import React, { useState } from 'react';
import type { Project } from '../types';
import { ProjectStatus } from '../types';

interface ProjectItemProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onToggleStep: (projectId: string, stepId: string) => void;
  onStartWork: (id: string) => void;
  onFinishWork: (id: string) => void;
  onAddStep: (projectId: string, stepName: string) => void;
}

const statusTexts: { [key in ProjectStatus]: string } = {
    [ProjectStatus.NotStarted]: 'មិនទាន់ចាប់ផ្តើម',
    [ProjectStatus.InProgress]: 'កំពុង​ដំណើរការ',
    [ProjectStatus.Done]: 'រួចរាល់',
};

const statusStyles: { [key in ProjectStatus]: { badge: string; border: string; } } = {
    [ProjectStatus.NotStarted]: {
        badge: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
        border: "border-slate-400 dark:border-slate-600",
    },
    [ProjectStatus.InProgress]: {
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
        border: "border-blue-500",
    },
    [ProjectStatus.Done]: {
        badge: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        border: "border-green-500",
    },
};

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
    const isWorking = status === ProjectStatus.InProgress;
    return (
      <div className="flex items-center gap-2">
        {isWorking && <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>}
        <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${statusStyles[status].badge}`}>
          {statusTexts[status]}
        </span>
      </div>
    );
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string | null; children?: React.ReactNode }> = ({ icon, label, value, children }) => {
    if (!value && !children) return null;
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-slate-400 dark:text-slate-500 flex-shrink-0">{icon}</div>
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                {value && <p className="font-medium text-slate-700 dark:text-slate-300">{value}</p>}
                {children}
            </div>
        </div>
    );
};

const DeadlineInfo: React.FC<{ deadline: string, isOverdue: boolean }> = ({ deadline, isOverdue }) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare dates only
    
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    let relativeTimeText: string;
    let textColor = "text-slate-700 dark:text-slate-300";

    if (isOverdue) {
        textColor = "text-red-600 dark:text-red-400";
        relativeTimeText = `ហួស​កំណត់ ${Math.abs(diffDays)} ថ្ងៃ`;
    } else if (diffDays === 0) {
        textColor = "text-yellow-600 dark:text-yellow-500";
        relativeTimeText = "ដល់​កំណត់​ថ្ងៃនេះ";
    } else if (diffDays === 1) {
        textColor = "text-yellow-600 dark:text-yellow-500";
        relativeTimeText = "ដល់​កំណត់​ថ្ងៃស្អែក";
    } else {
        relativeTimeText = `ដល់​កំណត់​ក្នុង​ ${diffDays} ថ្ងៃ`;
    }
    
    return (
        <div className="flex flex-col">
            <p className="font-medium text-slate-700 dark:text-slate-300">
                {deadlineDate.toLocaleDateString('km-KH', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <p className={`text-xs font-semibold ${textColor}`}>
                {relativeTimeText}
            </p>
        </div>
    );
};


const ProjectItem: React.FC<ProjectItemProps> = ({ project, onEdit, onDelete, onToggleStep, onStartWork, onFinishWork, onAddStep }) => {
  const { id, name, location, owner, designer, deadline, status, startDate, endDate, steps } = project;
  
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepName, setNewStepName] = useState('');
  
  const isOverdue = deadline ? new Date(deadline) < new Date() && status !== ProjectStatus.Done : false;

  const totalSteps = steps?.length || 0;
  const completedSteps = steps?.filter(s => s.completed).length || 0;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const handleAddStep = () => {
    if (newStepName.trim()) {
        onAddStep(id, newStepName.trim());
        setNewStepName('');
        setIsAddingStep(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-800/50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border ${isOverdue ? 'border-red-500' : statusStyles[status].border} border-l-4 flex flex-col justify-between overflow-hidden`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 pr-4 font-display">{name}</h3>
            <div className="flex items-center gap-2">
                {isOverdue && (
                     <div className="flex items-center gap-1 text-red-600 dark:text-red-400" title="This project is overdue">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                         <span className="text-xs font-bold hidden sm:inline">ហួសកាលកំណត់</span>
                     </div>
                )}
                <StatusBadge status={status} />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 text-sm">
            <InfoRow icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>} label="ទីតាំង" value={location} />
            <InfoRow icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>} label="ម្ចាស់គម្រោង" value={owner} />
            {designer && <InfoRow icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 5 3 3"/><path d="M22 6a2 2 0 0 1-2 2h-1.172a2 2 0 0 0-1.414.586l-7.172 7.172a2 2 0 0 1-2.828 0L2 12.586a2 2 0 0 1 0-2.828l7.172-7.172a2 2 0 0 0 .586-1.414H10a2 2 0 0 1 2-2Z"/></svg>} label="វិស្វករគ្រឿងផ្គុំ" value={designer} />}
            {deadline && (
                <InfoRow icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>} label="កាលបរិច្ឆេទ​កំណត់">
                    <DeadlineInfo deadline={deadline} isOverdue={isOverdue} />
                </InfoRow>
            )}
        </div>
        {(startDate || endDate) && (
             <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 text-sm">
                {startDate && <InfoRow icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>} label="ថ្ងៃចាប់ផ្តើម" value={new Date(startDate).toLocaleDateString('km-KH', { day: '2-digit', month: 'long', year: 'numeric' })} />}
                {endDate && <InfoRow icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><rect width="6" height="6" x="9" y="9"/></svg>} label="ថ្ងៃបញ្ចប់" value={new Date(endDate).toLocaleDateString('km-KH', { day: '2-digit', month: 'long', year: 'numeric' })} />}
             </div>
        )}
      </div>
       <div className="px-5 pb-5">
            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">ជំហានការងារ</h4>
            {totalSteps > 0 && (
                <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">វឌ្ឍនភាព</span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{completedSteps} / {totalSteps} ជំហាន</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                    </div>
                    <ul className="space-y-2.5 max-h-40 overflow-y-auto pr-2">
                        {steps.map(step => (
                            <li key={step.id}>
                                <label className="flex items-center gap-3 cursor-pointer group w-full">
                                    <input 
                                        type="checkbox" 
                                        checked={step.completed}
                                        onChange={() => onToggleStep(id, step.id)}
                                        className="w-5 h-5 rounded-md text-indigo-600 bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500 focus:ring-indigo-500 focus:ring-2 focus:ring-offset-2 dark:ring-offset-slate-800/50 transition-colors flex-shrink-0"
                                    />
                                    <div className="flex-grow flex justify-between items-center gap-2">
                                        <span className={`text-sm ${step.completed ? 'line-through text-slate-500' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100'}`}>{step.name}</span>
                                        {step.completed && step.completedAt && (
                                            <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap flex-shrink-0">
                                                {new Date(step.completedAt).toLocaleDateString('km-KH', { day: '2-digit', month: 'short' })}
                                            </span>
                                        )}
                                    </div>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-1">
            {isAddingStep ? (
                <div className="flex gap-2">
                    <input 
                        type="text"
                        value={newStepName}
                        onChange={e => setNewStepName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddStep())}
                        placeholder="បញ្ចូលឈ្មោះជំហានថ្មី..."
                        className="flex-grow px-3 py-1.5 text-sm bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        autoFocus
                    />
                    <button onClick={handleAddStep} className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900 font-semibold text-sm transition" aria-label="Save new step">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                    <button onClick={() => setIsAddingStep(false)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold text-sm transition" aria-label="Cancel adding step">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsAddingStep(true)} className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    <span>បន្ថែមជំហានថ្មី</span>
                </button>
            )}
            </div>
        </div>
      <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700/50 flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-2">
            {status === ProjectStatus.NotStarted && (
                <button onClick={() => onStartWork(id)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    <span>ចាប់ផ្តើមការងារ</span>
                </button>
            )}
            {status === ProjectStatus.InProgress && totalSteps === 0 && (
                <button onClick={() => onFinishWork(id)} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span>បញ្ចប់ការងារ</span>
                </button>
            )}
        </div>
        <div className="flex gap-2">
            <button onClick={() => onEdit(project)} className="p-2 text-slate-500 dark:text-slate-400 rounded-md hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-500/20 dark:hover:text-yellow-400 transition" aria-label="កែប្រែគម្រោង">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </button>
            <button onClick={() => onDelete(id)} className="p-2 text-slate-500 dark:text-slate-400 rounded-md hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition" aria-label="លុបគម្រោង">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;