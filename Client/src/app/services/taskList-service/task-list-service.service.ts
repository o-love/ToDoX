import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaskList } from 'src/app/models/taskList';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {
  private apiUrl = 'http://localhost:8082/api/boards';

  boardLists: Map<string, Map<string, TaskList>> = new Map();

  constructor(private http: HttpClient) { }

  getTaskListsByBoardId(boardId: string): Observable<TaskList[]> {
    const lists = this.boardLists.get(boardId)?.values();
    if (lists) return of(Array.from(lists));

    const http = this.http.get<TaskList[]>(`${this.apiUrl}/${boardId}/lists`);

    http.subscribe({
      next: (lists: TaskList[]) => {
        let mapLists: Map<string, TaskList> = new Map();
        lists.forEach((list) => mapLists.set(list.id, list))
        this.boardLists.set(boardId, mapLists);
      }
    })

    return http;
  }

  getListById(boardId: string, taskListId: string): Observable<TaskList> {
    const lists = this.boardLists.get(boardId);
    if (lists) {
      const list = lists.get(taskListId);
      if (list) return of(list);
    } 

    const http = this.http.get<TaskList>(`${this.apiUrl}/${boardId}/lists/${taskListId}`);    

    http.subscribe({
      next: (list: TaskList) => {
        let boardLists = this.boardLists.get(boardId);
        if (!boardLists) boardLists = new Map<string, TaskList>();
        boardLists.set(taskListId, list);
      }
    })

    return http;
  }

  createList(boardId: string, name: string, description: string): Observable<any> {
    const http = this.http.post(`${this.apiUrl}/${boardId}/lists`, { name: name, description: description, board_id: boardId, state_ids: [1, 2, 3] });

    http.subscribe({
      next: (list: any) => {
        let boardLists = this.boardLists.get(boardId);
        if (!boardLists) boardLists = new Map<string, TaskList>();
        boardLists.set(list.id, list);
        this.boardLists.set(boardId, boardLists);
      }
    })

    return http;
  }

  editTasklist(boardId: string, taskListId: string, name: string, description: string): Observable<TaskList> {
    const http = this.http.put<TaskList>(`${this.apiUrl}/${boardId}/lists/${taskListId}`, { name: name, description: description });

    http.subscribe({
      next: (list: TaskList) => {
        let boardLists = this.boardLists.get(boardId);
        if (!boardLists) boardLists = new Map<string, TaskList>();
        boardLists.set(taskListId, list);
        this.boardLists.set(boardId, boardLists);
      }
    })

    return http;
  }

  deleteTasklist(boardId: string, taskListId: string): Observable<any> {
    const http = this.http.delete(`${this.apiUrl}/${boardId}/lists/${taskListId}`);

    http.subscribe({
      next: () => {
        let boardLists = this.boardLists.get(boardId);
        if (boardLists) boardLists.delete(taskListId);
        else boardLists = new Map<string, TaskList>();
        this.boardLists.set(boardId, boardLists);
      }
    })

    return http;
  }
}