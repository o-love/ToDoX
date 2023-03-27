import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from 'src/app/models/board';
import { TaskList } from 'src/app/models/taskList';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = 'http://localhost:8082/api/boards';

  constructor(private http: HttpClient) { }

  // Gets all boards from backend
  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl);
  }

  // Gets a board by id
  getBoard(id: string): Observable<Board> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Board>(url); // El problema está aquí C:
  }

  // Creates a new board in backend
  createBoard(boardName: string, boardDescription: string): Observable<any> {
    const board = {
      name: boardName,
      description: boardDescription,
    };
    return this.http.post(`${this.apiUrl}`, board);
  }

  // Gets all taskLists from backend related to a certain board by boardId
  getTaskListsByBoardId(boardId: string): Observable<TaskList[]> {
    return this.http.get<TaskList[]>(`${this.apiUrl}/${boardId}/lists`);
  }

  // Gets a taskList by id and board id
  getList(boardId: string, taskListId: string): Observable<TaskList> {
    return this.http.get<TaskList>(`${this.apiUrl}/${boardId}/lists/${taskListId}`);
  }

  // Creates a new taskList in backend related to a board by boardId
  createList(boardId: string, listName: string, listDescription: string): Observable<any> {
    const list = {
      name: listName,
      description: listDescription,
      board_id: boardId,
    };
    return this.http.post(`${this.apiUrl}/${boardId}/lists`, list);
  }
}