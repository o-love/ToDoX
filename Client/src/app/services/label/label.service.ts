import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) { }

  getLabels(boardId: number, taskListId: number): Observable<any> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${taskListId}/labels`;
    return this.http.get(url);
  }

  createLabel(boardId: number, taskListId: number, label: any): Observable<any> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${taskListId}/labels`;
    return this.http.post(url, label);
  }

  getLabel(boardId: number, taskId: number, labelId: number): Observable<any> {
    const url = `${this.apiUrl}/boards/${boardId}/tasks/${taskId}/labels/${labelId}`;
    return this.http.get(url);
  }

  updateLabel(labelId: number, label: any): Observable<any> {
    const url = `${this.apiUrl}/labels/${labelId}`;
    return this.http.put(url, label);
  }

  deleteLabel(labelId: number): Observable<any> {
    const url = `${this.apiUrl}/labels/${labelId}`;
    return this.http.delete(url);
  }

  assignLabelToTask(boardId: number, taskListId: number, taskId: number, labelIds: number[]): Observable<any> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${taskListId}/tasks/${taskId}/labels`;
    const body = { label_ids: labelIds };
    return this.http.post(url, body);
  }

  deassignLabelFromTask(boardId: number, taskListId: number, taskId: number, labelIds: number[]): Observable<any> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${taskListId}/tasks/${taskId}/labels`;
    const body = { label_ids: labelIds };
    return this.http.request('delete', url, { body });
  }

  getTaskLabels(boardId: number, taskListId: number, taskId: number): Observable<any> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${taskListId}/tasks/${taskId}/labels`;
    return this.http.get(url);
  }
}
