export interface Task {
  id: number;
  name: string;
  description: string;
  tasklist_id: number;
  state_id: number;
  start_date: Date | null;
  due_date: Date | null;
  isEditing: boolean;
  state_position: number;
  selectedLabels: number[];
  recurring_period: string;
}