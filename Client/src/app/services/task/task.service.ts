import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from 'src/app/models/task';
import { Label } from 'src/app/models/label';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  async getTasksByTaskListId(boardId: string, listId: string): Promise<Task[]> {
    let tasks: any = this.cacheService.getCachedTasks(listId);
    console.log('cached tasks:', tasks);
    if (tasks && tasks.length > 0) return new Promise((resolve) => resolve(tasks));

    console.log('GET tasks...');
    const http = this.http.get<Task[]>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks`);

    return await new Promise((resolve) => 
      http.subscribe({
        next: (tasks: Task[]) => {
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
    stateId: string, selectedLabels: Label[], startDate: Date | null, dueDate: Date | null, 
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
    stateId: string, selectedLabels: Label[], startDate: Date | null, dueDate: Date | null, periodicity: string
  ): Promise<Task> {
    console.log('PUT task %d...', taskId);
    const http = this.http.put<Task>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}`, {
      name: taskName,
      description: taskDescription,
      state_id: stateId,
      selectedLabels: selectedLabels,
      start_date: startDate,
      due_date: dueDate,
      recurring_period: periodicity
    });

    return await new Promise((resolve) => 
      http.subscribe({
        next: (task: Task) => {
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
}