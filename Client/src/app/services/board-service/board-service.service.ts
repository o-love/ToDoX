import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = 'http://localhost:8082//api/boards'; 

  constructor(private http: HttpClient) {}

  // Gets all boards from backend
  getBoards(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Creates a new board in backend
  createBoard(boardName: string): Observable<any> {
    return this.http.post(this.apiUrl, { name: boardName });
  }
}