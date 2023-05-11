import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Board } from 'src/app/models/board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) { }

  boards: Map<string, Board> = new Map<string, Board>();

  getBoards(): Observable<Board[]> {
    const http = this.http.get<Board[]>(`${this.apiUrl}/boards`);

    http.subscribe({
      next: (boards: Board[]) => boards.forEach((board) => this.boards.set(board.id, board)),
      error: (err: any) => console.error('error getting boards:', err)
    })

    return http;
  }

  getBoardById(id: string): Observable<Board> {
    const board = this.boards.get(id);
    if (board) return of(board);

    const http = this.http.get<Board>(`${this.apiUrl}/boards/${id}`);

    http.subscribe({
      next: (board: Board) => this.boards.set(board.id, board),
      error: (err: any) => console.error('error getting board by id:', err)
    })

    return http;
  }

  editBoard(id: string, name: string, description: string): Observable<any> {
    const http = this.http.put(`${this.apiUrl}/boards/${id}`, { name: name, description: description });

    http.subscribe({
      next: () => {
        const board = this.boards.get(id);
        if (board) {
          board.name = name;
          board.description = description;
          this.boards.set(id, board);
        }
      },
      error: (err: any) => console.error('error editing board:', err)
    })

    return http;
  }

  deleteBoard(id: string): Observable<any> {
    const http = this.http.delete(`${this.apiUrl}/boards/${id}`);

    http.subscribe({
      next: () => this.boards.delete(id),
      error: (err: any) => console.error('error deleting board:', err)
    })

    return http;
  }

  createBoard(name: string, description: string): Observable<any> {
    const http =  this.http.post(`${this.apiUrl}/boards`, { name: name, description: description });

    http.subscribe({
      next: (board: any) => this.boards.set(board.id, board),
      error: (err: any) => console.error('error creating board:', err)
    })

    return http;
  }
}