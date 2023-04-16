export interface State {
  id: number;
  name: string;
  tasks: number[]; // IDs de las tareas que tienen este estado
}