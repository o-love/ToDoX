import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from 'src/app/models/board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = 'http://localhost:8082/api/boards'; 

  constructor(private http: HttpClient) {}

  // Gets all boards from backend
  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl);
  }

  // Creates a new board in backend
  createBoard(boardName: string, boardDescription: string): Observable<any> {
    const board = {
      name: boardName,
      description: boardDescription,
    };
    return this.http.post(`${this.apiUrl}/createBoard`, board);
  }
}