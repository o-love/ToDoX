import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Board } from 'src/app/models/board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = 'http://localhost:8082/api/boards';

  constructor(private http: HttpClient) { }

  boards: Map<string, Board> = new Map<string, Board>();

  getBoards(): Observable<Board[]> {
    const http = this.http.get<Board[]>(`${this.apiUrl}`);

    http.subscribe({
      next: (boards: Board[]) => boards.forEach((board) => this.boards.set(board.id, board))
    })

    return http;
  }

  getBoardById(id: string): Observable<Board> {
    const board = this.boards.get(id);
    if (board) return of(board);

    const http = this.http.get<Board>(`${this.apiUrl}/${id}`);

    http.subscribe({
      next: (board: Board) => this.boards.set(board.id, board)
    })

    return http;
  }

  editBoard(id: string, name: string, description: string): Observable<any> {
    const http = this.http.put(`${this.apiUrl}/${id}`, { name: name, description: description });

    http.subscribe({
      next: () => {
        const board = this.boards.get(id);
        if (board) {
          board.name = name;
          board.description = description;
          this.boards.set(id, board);
        }
      },
      error: (err: any) => console.log(err)
    })

    return http;
  }

  deleteBoard(id: string): Observable<any> {
    const http = this.http.delete(`${this.apiUrl}/${id}`);

    http.subscribe({
      next: () => this.boards.delete(id)
    })

    return http;
  }

  createBoard(name: string, description: string): Observable<any> {
    const http =  this.http.post(`${this.apiUrl}`, { name: name, description: description });

    http.subscribe({
      next: (board: any) => this.boards.set(board.id, board)
    })

    return http;
  }
}