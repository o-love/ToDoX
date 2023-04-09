import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from 'src/app/models/board';
import { TaskList } from 'src/app/models/taskList';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) { }

  // Gets all boards from backend
  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.apiUrl}/boards`);
  }

  // Gets a board by id
  getBoard(id: string): Observable<Board> {
    const url = `${this.apiUrl}/boards/${id}`;
    return this.http.get<Board>(url);
  }

  // Updates a board by id
  editBoard(id: number, name: string, description: string): Observable<any> {
    const board = {
      name,
      description
    };
    return this.http.put(`${this.apiUrl}/boards/${id}`, board);
  }

  // Deletes a board by id
  deleteBoard(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/boards/${id}`);
  }

  // Creates a new board in backend
  createBoard(boardName: string, boardDescription: string): Observable<any> {
    const board = {
      name: boardName,
      description: boardDescription,
    };
    return this.http.post(`${this.apiUrl}/boards`, board);
  }

  // Gets all taskLists from backend related to a certain board by boardId
  getTaskListsByBoardId(boardId: string): Observable<TaskList[]> {
    return this.http.get<TaskList[]>(`${this.apiUrl}/boards/${boardId}/lists`);
  }

  // Gets a taskList by id and board id
  getList(boardId: string, taskListId: string): Observable<TaskList> {
    return this.http.get<TaskList>(`${this.apiUrl}/boards/${boardId}/lists/${taskListId}`);
  }

  // Creates a new taskList in backend related to a board by boardId
  createList(boardId: string, listName: string, listDescription: string, stateIds: number[]): Observable<any> {
    const list = {
      name: listName,
      description: listDescription,
      board_id: boardId,
      state_ids: stateIds,
    };
    return this.http.post(`${this.apiUrl}/boards/${boardId}/lists`, list);
  }

  // Updates a tasklist by id and board id
  editTasklist(boardId: string, taskListId: string, name: string, description: string): Observable<TaskList> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${taskListId}`;
    const taskList = { name, description };
    return this.http.put<TaskList>(url, taskList);
  }

  // Deletes a tasklist by id and board id
  deleteTasklist(boardId: string, taskListId: string): Observable<any> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${taskListId}`;
    return this.http.delete(url);
  }
}