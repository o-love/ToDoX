import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskList } from 'src/app/models/taskList';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private cacheService: CacheService) { }

  hasCachedTaskList(taskListId: string): boolean {
    return (this.cacheService.getCachedTaskListById(taskListId) != undefined);
  }

  async getTaskListsByBoardId(boardId: string): Promise<TaskList[]> {
    let lists: any = this.cacheService.getCachedTaskLists(boardId);
    console.log('cached tasklists:', lists);
    if (lists && lists.length > 0) return new Promise((resolve) => resolve(lists));

    console.log('GET tasklists...');
    const http = this.http.get<TaskList[]>(`${this.apiUrl}/boards/${boardId}/lists`);

    return await new Promise((resolve) => 
      http.subscribe({
        next: (lists: TaskList[]) => {
          this.cacheService.storeTaskLists(lists);
          console.log('tasklists retrieved:', lists);
          resolve(lists);
        },
        error: (err: any) => console.error('error getting all tasklists by board id:', err)
      })
    )
  }

  async getListById(boardId: string, taskListId: string): Promise<TaskList> {
    let list: any = this.cacheService.getCachedTaskListById(taskListId);
    console.log('cached tasklist:', list)
    if (list) return new Promise((resolve) => resolve(list));

    console.log('GET tasklist %d...', taskListId);
    const http = this.http.get<TaskList>(`${this.apiUrl}/boards/${boardId}/lists/${taskListId}`);    

    return await new Promise((resolve) =>
      http.subscribe({
        next: (list: TaskList) => {
          this.cacheService.storeTaskList(list);
          console.log('tasklist retrieved:', list);
          resolve(list);
        },
        error: (err: any) => console.error('error getting tasklist by id in a board:', err)
      })
    );
  }

  // change when added labels
  async createList(boardId: string, name: string, description: string): Promise<any> {
    console.log('POST tasklist...');
    const http = this.http.post(`${this.apiUrl}/boards/${boardId}/lists`, { name: name, description: description, board_id: boardId, state_ids: [1, 2, 3] });

    return await new Promise((resolve) => 
      http.subscribe({
        next: (list: any) => {
          this.cacheService.storeTaskList(list);
          console.log('created tasklist:', list);
          resolve(list);
        },
        error: (err: any) => console.error('error creating a tasklist:', err)
      })
    );
  }

  async editTasklist(boardId: string, taskListId: string, name: string, description: string): Promise<TaskList> {
    console.log('PUT tasklist %d...', taskListId);
    const http = this.http.put<TaskList>(`${this.apiUrl}/boards/${boardId}/lists/${taskListId}`, { name: name, description: description });

    return await new Promise((resolve) => 
      http.subscribe({
        next: (list: TaskList) => {
          this.cacheService.storeTaskList(list); 
          console.log('tasklist edited:', list);
          resolve(list);
        },
        error: (err: any) => console.error('error editing a tasklist:', err)
      })
    )
  }

  async deleteTasklist(boardId: string, taskListId: string): Promise<any> {
    console.log('DELETE tasklist %d...', taskListId);
    const http = this.http.delete(`${this.apiUrl}/boards/${boardId}/lists/${taskListId}`);

    return await new Promise((resolve) => 
      http.subscribe({
        next: () => {
          this.cacheService.deleteTaskList(taskListId);
          console.log('tasklist deleted');
          resolve(null);
        },
        error: (err: any) => console.error('error deleting a tasklist:', err)
      })
    )
  }
}