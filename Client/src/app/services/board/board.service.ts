import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board } from 'src/app/models/board';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  async getBoards(): Promise<Board[]> {
    let boards: Board[] = this.cacheService.getCachedBoards();
    console.log('cached boards:', boards);
    if (boards && boards.length > 0) return new Promise((resolve) => resolve(boards));

    console.log('GET boards...');
    const http = this.http.get<Board[]>(`${this.apiUrl}/boards`);

    return await new Promise((resolve) => 
      http.subscribe({
        next: (boards: Board[]) => {
          this.cacheService.storeBoards(boards);
          console.log('boards retrieved:', boards);
          resolve(boards);
        },
        error: (err: any) => console.error('error getting boards:', err)
      })
    );
  }

  async getBoardById(id: string): Promise<Board> {
    let board: any = this.cacheService.getCachedBoardById(id);
    console.log('cached board:', board);
    if (board) return new Promise((resolve) => resolve(board));

    console.log('GET board %d...', id);
    const http = this.http.get<Board>(`${this.apiUrl}/boards/${id}`);

    return await new Promise((resolve) => 
      http.subscribe({
        next: (board: Board) => {
          this.cacheService.storeBoard(board);
          console.log('board retrieved:', board);
          resolve(board);
        },
        error: (err: any) => console.error('error getting board by id:', err)
      })
    );
  }

  async editBoard(id: string, name: string, description: string): Promise<any> {
    console.log('PUT board %d...', id);
    const http = this.http.put(`${this.apiUrl}/boards/${id}`, { name: name, description: description });

    return await new Promise((resolve) => 
      http.subscribe({
        next: (board: any) => {
          this.cacheService.storeBoard(board);
          console.log('board edited:', board);
          resolve(board);
        },
        error: (err: any) => console.error('error editing board:', err)
      })
    );
  }

  async deleteBoard(id: string): Promise<any> {
    console.log('DELETE board %d...', id);
    const http = this.http.delete(`${this.apiUrl}/boards/${id}`);

    return await new Promise((resolve) => 
      http.subscribe({
        next: () => {
          this.cacheService.deleteBoard(id);
          console.log('board deleted');
          resolve(null);
        },
        error: (err: any) => console.error('error deleting board:', err)
      })
    )
  }

  async createBoard(name: string, description: string): Promise<any> {
    console.log('POST board...');
    const http =  this.http.post(`${this.apiUrl}/boards`, { name: name, description: description });

    return await new Promise((resolve) => 
      http.subscribe({
        next: (board: any) => {
          this.cacheService.storeBoard(board);
          resolve(board);
        },
        error: (err: any) => console.error('error creating board:', err)
      })
    )
  }
}