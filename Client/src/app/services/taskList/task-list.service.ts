import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { TaskList } from 'src/app/models/taskList';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {
  private apiUrl = 'http://localhost:8082/api';
  private boardLists: Map<string, Map<string, TaskList>> = new Map();

  constructor(private http: HttpClient) { }

  hasCachedTaskList(boardId: string, taskListId: string): boolean {
    return this.boardLists.get(boardId)?.get(taskListId) != null;
  }

  private getCachedTaskLists(boardId: string): string[] {
    let lists: any = this.boardLists.has(boardId) ? this.boardLists.get(boardId) : new Map();
    return Array.from(lists);
  }

  getTaskListsByBoardId(boardId: string): Observable<TaskList[]> {
    let lists: any = this.getCachedTaskLists(boardId);
    console.log('cached lists:', lists);
    if (lists.length > 0) return of(lists);

    console.log('GET lists...');
    const http = this.http.get<TaskList[]>(`${this.apiUrl}/boards/${boardId}/lists`);

    http.subscribe({
      next: (lists: TaskList[]) => {
        let mapLists: Map<string, TaskList> = new Map();
        lists.forEach((list) => mapLists.set(list.id, list))
        this.boardLists.set(boardId, mapLists);
      },
      error: (err: any) => console.error('error getting all tasklists by board id:', err)
    })

    return http;
  }

  getListById(boardId: string, taskListId: string): Observable<TaskList> {
    let list: any = this.boardLists.get(boardId)?.get(taskListId);
    console.log('cached list:', list)
    if (list) return of(list);

    console.log('GET list %d...', taskListId);
    const http = this.http.get<TaskList>(`${this.apiUrl}/boards/${boardId}/lists/${taskListId}`);    

    http.subscribe({
      next: (list: TaskList) => {
        let boardLists = this.boardLists.get(boardId);
        if (!boardLists) boardLists = new Map<string, TaskList>();
        boardLists.set(taskListId, list);
      },
      error: (err: any) => console.error('error getting tasklist by id in a board:', err)
    })

    return http;
  }

  // change when added labels
  createList(boardId: string, name: string, description: string): Observable<any> {
    console.log('POST list...');
    const http = this.http.post(`${this.apiUrl}/boards/${boardId}/lists`, { name: name, description: description, board_id: boardId, state_ids: [1, 2, 3] });

    http.subscribe({
      next: (list: any) => {
        let boardLists = this.boardLists.get(boardId);
        if (!boardLists) boardLists = new Map<string, TaskList>();
        boardLists.set(list.id, list);
        this.boardLists.set(boardId, boardLists);
      },
      error: (err: any) => console.error('error creating a tasklist:', err)
    })

    return http;
  }

  editTasklist(boardId: string, taskListId: string, name: string, description: string): Observable<TaskList> {
    console.log('PUT list %d...', taskListId);
    const http = this.http.put<TaskList>(`${this.apiUrl}/boards/${boardId}/lists/${taskListId}`, { name: name, description: description });

    http.subscribe({
      next: (list: TaskList) => {
        let boardLists = this.boardLists.get(boardId);
        if (!boardLists) boardLists = new Map<string, TaskList>();
        boardLists.set(taskListId, list);
        this.boardLists.set(boardId, boardLists);
      },
      error: (err: any) => console.error('error editing a tasklist:', err)
    })

    return http;
  }

  deleteTasklist(boardId: string, taskListId: string): Observable<any> {
    console.log('DELETE list %d...', taskListId);
    const http = this.http.delete(`${this.apiUrl}/boards/${boardId}/lists/${taskListId}`);

    http.subscribe({
      next: () => {
        let boardLists = this.boardLists.get(boardId);
        if (boardLists) boardLists.delete(taskListId);
        else boardLists = new Map<string, TaskList>();
        this.boardLists.set(boardId, boardLists);
      },
      error: (err: any) => console.error('error deleting a tasklist:', err)
    })

    return http;
  }
}