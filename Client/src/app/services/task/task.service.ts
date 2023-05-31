import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from 'src/app/models/task';
import { CacheService } from '../cache/cache.service';
import { LabelService } from '../label/label.service';
import { Label } from 'src/app/models/label';
import { Observable, of, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private cacheService: CacheService, private labelService: LabelService) {}

  async getTasksByTaskListId(boardId: string, listId: string): Promise<Task[]> {
    let tasks: any = this.cacheService.getCachedTasks(listId);
    console.log('cached tasks:', tasks);
    if (tasks && tasks.length > 0) return new Promise((resolve) => resolve(tasks));

    console.log('GET tasks...');
    const http = this.http.get<Task[]>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks`);

    return await new Promise((resolve) => 
      http.subscribe({
        next: (tasks: Task[]) => {
          tasks.forEach((task: Task) => { 
            if (!task.selectedLabels) task.selectedLabels = [];
          });
          this.cacheService.storeTasks(tasks);
          console.log('tasks retrieved:', tasks);
          resolve(tasks);
        },
        error: (err: any) => console.error('error getting all tasks by tasklist and board id:', err)
      })
    );
  }

  async getTaskById(boardId: string, listId: string, taskId: number): Promise<Task> {
    let task: any = this.cacheService.getCachedTaskById(taskId);
    console.log('cached task:', task);
    if (task) return new Promise((resolve) => resolve(task));
    
    console.log('GET task %d...', taskId);
    const http = this.http.get<Task>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}`);

    return await new Promise((resolve) => 
      http.subscribe({
        next: (task: Task) => {
          if (!task.selectedLabels) task.selectedLabels = [];
          this.cacheService.storeTask(task);
          console.log('task retrieved:', task);
          resolve(task);
        },
        error: (err: any) => console.error('error getting task by id:', err)
      })
    );
  }

  // Creates a new task in backend related to a taskList related to a board
  async createTask(
    boardId: string, listId: string, taskName: string, taskDescription: string,
    stateId: string, selectedLabels: number[], startDate: Date | null, dueDate: Date | null, 
    periodicity: string, state_position: number = 0
  ): Promise<Task> {
    console.log('POST task...');
    const http = this.http.post<Task>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks`, {
        name: taskName,
        description: taskDescription,
        tasklist_id: listId,
        state_id: stateId,
        selectedLabels: selectedLabels,
        start_date: startDate,
        due_date: dueDate,
        state_position: state_position,
        recurring_period: periodicity
    });

    return await new Promise((resolve) =>
      http.subscribe({
        next: (task: Task) => {
          task.selectedLabels = selectedLabels;
          this.cacheService.storeTask(task); 
          console.log('created task:', task);
          resolve(task);
        },
        error: (err: any) => console.error('error creating a new task:', err)
      })
    );
  }

  // Updates a task by id, list id and board id - REV opt with createTask
  async editTask(
    boardId: string, listId: string, taskId: string, taskName: string, taskDescription: string,
    stateId: string, selectedLabels: number[], startDate: Date | null, dueDate: Date | null, periodicity: string
  ): Promise<Task> {
    console.log('PUT task %d...', taskId);
    const http = this.http.put<Task>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}/update`, {
      name: taskName,
      description: taskDescription,
      state_id: stateId,
      selectedLabels: selectedLabels,
      start_date: startDate,
      tasklist_id: listId,
      due_date: dueDate,
      recurring_period: periodicity
    });

    return await new Promise((resolve) => 
      http.subscribe({
        next: (task: Task) => {
          task.selectedLabels = selectedLabels;
          this.cacheService.storeTask(task) 
          console.log('edited task:', task);
          resolve(task);
        },
        error: (err: any) => console.error('error editing a task:', err)
      })
    );
  }

  // Deletes a tasklist by id, list id and board id
  async deleteTask(boardId: string, listId: string, taskId: number): Promise<any> {
    console.log('DELETE task %d...', taskId);
    const http = this.http.delete(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}`);

    return await new Promise((resolve) => 
      http.subscribe({
        next: () => {
          this.cacheService.deleteTask(taskId); 
          console.log('task deleted');
          resolve(null);
        },
        error: (err: any) => console.error('error deleting a task:', err)
      })
    );
  }

  async moveTask(boardId: string, listId: string, taskId: number, labels: number[], NewlistTaskId: string, NewstateId: string): Promise<Task> {
    console.log('moving task...');
    const http = this.http.put<Task>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}/move`, { 
      tasklist_id: NewlistTaskId, 
      selectedLabels: [],
      state_id: NewstateId
    })

    return await new Promise((resolve) =>
      http.subscribe({
        next: (task: Task) => {
          task.selectedLabels = [];
          this.cacheService.storeTask(task);
          console.log('task retrieved:', task);
          resolve(task);
        }
      })
    );
  }

  async copyTask(boardId: string, task: Task, labels: number[], newlistId: string, NewstateId: string): Promise<Task> {
    return this.createTask(boardId, newlistId, task.name, task.description, NewstateId, labels, task.start_date, task.due_date, task.periodicity, task.state_position);
  }

  getTaskByDueDate(boardId: string, listId: string): Observable<Task[]> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks`;
    return this.http.get<Task[]>(url).pipe(
      map((tasks: Task[]) => {
        // Ordenar tareas por fecha de inicio
        tasks.sort((a, b) => {
          const startDateA = a.start_date ? new Date(a.start_date) : null;
          const startDateB = b.start_date ? new Date(b.start_date) : null;
          if (startDateA && startDateB) {
            return startDateA.getTime() - startDateB.getTime();
          } else if (startDateA) {
            return -1;
          } else if (startDateB) {
            return 1;
          } else {
            return 0;
          }
        });
        return tasks;
      })
    );
  }

  getTaskByStartDate(boardId: string, listId: string): Observable<Task[]> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks`;
    return this.http.get<Task[]>(url).pipe(
      map((tasks: Task[]) => {
        // Filtrar las tareas con fecha de vencimiento y ordenarlas por fecha
        const tasksWithDueDate = tasks.filter(task => task.due_date !== null);
        tasksWithDueDate.sort((a, b) => {
          const dueDateA = new Date(a.due_date!);
          const dueDateB = new Date(b.due_date!);
          return dueDateA.getTime() - dueDateB.getTime();
        });
  
        // Concatenar las tareas sin fecha de vencimiento al final del array
        const tasksWithoutDueDate = tasks.filter(task => task.due_date === null);
        const sortedTasks = tasksWithDueDate.concat(tasksWithoutDueDate);
  
        return sortedTasks;
      })
    );
  }


  getTaskByState(boardId: string, listId: string, stateIds: number[]): Observable<Task[]> {
    const stateIdParams = stateIds.join(',');
    const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks?state_id=${stateIdParams}`;
    return this.http.get<Task[]>(url).pipe(
      map(tasks => tasks.sort((a, b) => stateIds.indexOf(a.state_id) - stateIds.indexOf(b.state_id))),
      switchMap(sortedTasks => of(sortedTasks))
    );
  }
}