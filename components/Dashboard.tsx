import React from 'react';
import { Project, ProjectStatus } from '../types';

interface DashboardProps {
  projects: Project[];
}

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md flex items-center gap-4 border border-slate-200 dark:border-slate-800">
    <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${color}`}>
        {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
);


const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
    const totalProjects = projects.length;
    const inProgressCount = projects.filter(p => p.status === ProjectStatus.InProgress).length;
    const doneCount = projects.filter(p => p.status === ProjectStatus.Done).length;
    const now = new Date();
    
    const overdueCount = projects.filter(p => 
        p.deadline && new Date(p.deadline) < now && p.status !== ProjectStatus.Done
    ).length;

    const upcomingDeadlines = projects
        .filter(p => {
            if (p.status === ProjectStatus.Done || !p.deadline) return false;
            const deadlineDate = new Date(p.deadline);
            const diffDays = (deadlineDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
            return diffDays >= 0 && diffDays <= 7;
        })
        .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  return (
    <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-display">ផ្ទាំងគ្រប់គ្រង</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard title="គម្រោងសរុប" value={totalProjects} color="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>} />
            <StatCard title="កំពុងដំណើរការ" value={inProgressCount} color="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>} />
            <StatCard title="បានបញ្ចប់" value={doneCount} color="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>} />
            <StatCard title="ហួសកាលកំណត់" value={overdueCount} color="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>} />
        </div>
        
        {upcomingDeadlines.length > 0 && (
             <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 font-display">កាលកំណត់ជិតមកដល់</h3>
                <ul className="space-y-3">
                    {upcomingDeadlines.map(p => {
                        const deadlineDate = new Date(p.deadline!);
                        const diffTime = deadlineDate.getTime() - now.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
                        return (
                            <li key={p.id} className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-700 dark:text-slate-300">{p.name}</span>
                                <span className="text-yellow-600 dark:text-yellow-400 font-semibold bg-yellow-100 dark:bg-yellow-900/50 px-2 py-0.5 rounded-full">
                                    {diffDays > 1 ? `ដល់​កំណត់​ក្នុង​ ${diffDays} ថ្ងៃ` : 'ដល់​កំណត់​ថ្ងៃស្អែក'}
                                </span>
                            </li>
                        )
                    })}
                </ul>
             </div>
        )}
    </div>
  );
};

export default Dashboard;