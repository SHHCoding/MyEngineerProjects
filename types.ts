export enum ProjectStatus {
  NotStarted = 'មិនទាន់ចាប់ផ្តើម',
  InProgress = 'កំពុង​ដំណើរការ',
  Done = 'រួចរាល់',
}

export interface Step {
  id: string;
  name: string;
  completed: boolean;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  owner: string;
  designer?: string;
  deadline?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  steps: Step[];
}