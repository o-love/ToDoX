import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Board } from 'src/app/models/board';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getBoards(): Observable<Board[]> {
    let boards: Board[] = this.cacheService.getCachedBoards();
    console.log('cached boards:', boards);
    if (boards.length > 0) return of(boards);

    console.log('GET boards...');
    const http = this.http.get<Board[]>(`${this.apiUrl}/boards`);

    http.subscribe({
      next: (boards: Board[]) => this.cacheService.storeBoards(boards),
      error: (err: any) => console.error('error getting boards:', err)
    })

    return http;
  }

  getBoardById(id: string): Observable<Board> {
    let board: any = this.cacheService.getCachedBoardById(id);
    console.log('cached board:', board);
    if (board) return of(board);

    console.log('GET board %d...', id);
    const http = this.http.get<Board>(`${this.apiUrl}/boards/${id}`);

    http.subscribe({
      next: (board: Board) => this.cacheService.storeBoard(board),
      error: (err: any) => console.error('error getting board by id:', err)
    })

    return http;
  }

  editBoard(id: string, name: string, description: string): Observable<any> {
    console.log('PUT board %d...', id);
    const http = this.http.put(`${this.apiUrl}/boards/${id}`, { name: name, description: description });

    http.subscribe({
      next: (board: any) => this.cacheService.storeBoard(board),
      error: (err: any) => console.error('error editing board:', err)
    })

    return http;
  }

  deleteBoard(id: string): Observable<any> {
    console.log('DELETE board %d...', id);
    const http = this.http.delete(`${this.apiUrl}/boards/${id}`);

    http.subscribe({
      next: () => this.cacheService.deleteBoard(id),
      error: (err: any) => console.error('error deleting board:', err)
    })

    return http;
  }

  createBoard(name: string, description: string): Observable<any> {
    console.log('POST board...');
    const http =  this.http.post(`${this.apiUrl}/boards`, { name: name, description: description });

    http.subscribe({
      next: (board: any) => this.cacheService.storeBoard(board),
      error: (err: any) => console.error('error creating board:', err)
    })

    return http;
  }
}