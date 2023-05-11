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
      next: (boards: Board[]) => {
        console.log('boards retrieved:', boards);
        boards.forEach((board) => {
          this.boards.set(board.id, board);
        })
      },
      error: (err: any) => console.error('error retrieving all boards:', err)
    })

    return http;
  }

  getBoardById(id: string): Observable<Board | undefined> {
    const url = `${this.apiUrl}/boards/${id}`;

    if (this.boards.has(id)) return of(this.boards.get(id));

    const http = this.http.get<Board>(url);

    http.subscribe({
      next: (board: Board) => {
        console.log('board retrieved:', board);
        this.boards.set(board.id, board);
      }, 
      error: (err: any) => console.error('error retrieving board by id:', err)
    })

    return http;
  }

  editBoard(id: string, name: string, description: string): Observable<any> {
    const http = this.http.put(`${this.apiUrl}/boards/${id}`, {name, description});
    
    const board: Board | undefined = this.boards.get(id);
    if (board) {
      board.name = name;
      board.description = description;
    }

    http.subscribe({
      next: () => {
        if (board) { 
          console.log('board saved:', id);
          this.boards.set(id, board);
        }
      },
      error: (err: any) => console.log(err)
    })

    return http;
  }

  deleteBoard(id: string): Observable<any> {
    const http = this.http.delete(`${this.apiUrl}/boards/${id}`);

    http.subscribe({
      next: () => {
        console.log('board deleted:', id);
        this.boards.delete(id);
      },
      error: (err: any) => console.error('error deleting board:', err)
    })

    return http;
  }

  createBoard(name: string, description: string): Observable<any> {
    const http =  this.http.post(`${this.apiUrl}/boards`, {name, description});

    http.subscribe({
      next: (board: any) => {
        console.log('board created:', board);
        this.boards.set(board.id, board);
      },
      error: (err: any) => console.error('error creating board:', err)
    })

    return http;
  }
}