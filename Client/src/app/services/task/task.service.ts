import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Task } from 'src/app/models/task';
import { Label } from 'src/app/models/label';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getTasksByTaskListId(boardId: string, listId: string): Observable<Task[]> {
    let tasks: any = this.cacheService.getCachedTasks(listId);
    console.log('cached tasks:', tasks);
    if (tasks && tasks.length > 0) return of(tasks);

    console.log('GET tasks...');
    const http = this.http.get<Task[]>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks`);

    http.subscribe({
      next: (tasks: Task[]) => this.cacheService.storeTasks(tasks),
      error: (err: any) => console.error('error getting all tasks by tasklist and board id:', err)
    })

    return http;
  }

  getTaskById(boardId: string, listId: string, taskId: number): Observable<Task> {
    let task: any = this.cacheService.getCachedTaskById(taskId);
    console.log('cached task:', task);
    if (task) return of(task);
    
    console.log('GET task %d...', taskId);
    const http = this.http.get<Task>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}`);

    http.subscribe({
      next: (task: Task) => this.cacheService.storeTask(task),
      error: (err: any) => console.error('error getting task by id:', err)
    })

    return http;
  }

  // Creates a new task in backend related to a taskList related to a board
  createTask(
    boardId: string, listId: string, taskName: string, taskDescription: string,
    stateId: string, selectedLabels: Label[], startDate: Date | null, dueDate: Date | null
  ): Observable<Task> {
    console.log('POST task...');
    const http = this.http.post<Task>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks`, {
        name: taskName,
        description: taskDescription,
        tasklist_id: listId,
        state_id: stateId,
        selectedLabels: selectedLabels,
        start_date: startDate,
        due_date: dueDate
    });

    http.subscribe({
      next: (task: Task) => this.cacheService.storeTask(task),
      error: (err: any) => console.error('error creating a new task:', err)
    })
    
    return http;
  }

  // Updates a task by id, list id and board id - REV opt with createTask
  editTask(
    boardId: string, listId: string, taskId: string, taskName: string, taskDescription: string,
    stateId: string, selectedLabels: Label[], startDate: Date | null, dueDate: Date | null
  ): Observable<Task> {
    console.log('PUT task %d...', taskId);
    const http = this.http.put<Task>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}`, {
      name: taskName,
      description: taskDescription,
      state_id: stateId,
      selectedLabels: selectedLabels,
      start_date: startDate,
      due_date: dueDate
    });

    http.subscribe({
      next: (task: Task) => this.cacheService.storeTask(task),
      error: (err: any) => console.error('error editing a task:', err)
    })

    return http;
  }

  // Deletes a tasklist by id, list id and board id
  deleteTask(boardId: string, listId: string, taskId: number): Observable<any> {
    console.log('DELETE task %d...', taskId);
    const http = this.http.delete(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}`);

    http.subscribe({
      next: () => this.cacheService.deleteTask(taskId),
      error: (err: any) => console.error('error deleting a task:', err)
    })

    return http;
  }
}