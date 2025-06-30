import React from 'react';
import { ProjectStatus } from '../types';

interface FilterControlsProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    filters: {
        status: string;
        time: string;
        owner: string;
        designer: string;
    };
    onFilterChange: <K extends keyof FilterControlsProps['filters']>(filter: K, value: string) => void;
    owners: string[];
    designers: string[];
    onAddProject: () => void;
    onImport: () => void;
    onExport: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
    searchTerm, 
    onSearchChange, 
    filters, 
    onFilterChange, 
    owners, 
    designers,
    onAddProject,
    onImport,
    onExport,
}) => {
  return (
    <div className="mb-8 p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white self-start sm:self-center font-display">បញ្ជីគម្រោង</h2>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
          <button
              onClick={onAddProject}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold text-sm leading-tight rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span>បន្ថែមគម្រោងថ្មី</span>
          </button>
           <div className="flex gap-3">
             <button
                onClick={onImport}
                title="Import Data from JSON file"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              <span className="hidden sm:inline">នាំចូល</span>
            </button>
            <button
                onClick={onExport}
                title="Export Data to JSON file"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              <span className="hidden sm:inline">នាំចេញ</span>
            </button>
        </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="relative lg:col-span-1 md:col-span-3 sm:col-span-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input
            type="text"
            placeholder="ស្វែងរកគម្រោង..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        
        <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
          <option value="">គ្រប់ស្ថានភាព</option>
          {Object.values(ProjectStatus).map(status => <option key={status} value={status}>{status}</option>)}
        </select>

        <select value={filters.time} onChange={(e) => onFilterChange('time', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
          <option value="">គ្រប់ពេលវេលា</option>
          <option value="week">សប្តាហ៍នេះ</option>
          <option value="month">ខែនេះ</option>
          <option value="year">ឆ្នាំនេះ</option>
        </select>

        <select value={filters.owner} onChange={(e) => onFilterChange('owner', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
          <option value="">ម្ចាស់គម្រោងទាំងអស់</option>
          {owners.map(owner => <option key={owner} value={owner}>{owner}</option>)}
        </select>
        
        <select value={filters.designer} onChange={(e) => onFilterChange('designer', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
          <option value="">វិស្វករទាំងអស់</option>
          {designers.map(designer => <option key={designer} value={designer}>{designer}</option>)}
        </select>
      </div>
    </div>
  );
};

export default FilterControls;