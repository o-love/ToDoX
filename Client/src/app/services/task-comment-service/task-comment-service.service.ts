import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TaskComment } from 'src/app/models/taskComment';

@Injectable({
  providedIn: 'root'
})
export class TaskCommentService {

  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) { }

  // Get task comments from a certain task
  getTaskComments(boardId: number, listId: number, taskId: number): Observable<TaskComment[]> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}/comments`;
    return this.http.get<TaskComment[]>(url);
  }

  // Create a task comment for a certain task
  addTaskComment(boardId: number, listId: number, taskId: number, content: string): Observable<TaskComment> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}/comments`;
    console.log("content", content);
    return this.http.post<TaskComment>(url, { content });
  }

  // Show information from a comment
  getTaskComment(commentId: number): Observable<TaskComment> {
    const url = `${this.apiUrl}/comments/${commentId}`;
    return this.http.get<TaskComment>(url);
  }

  // Update a comment
  updateTaskComment(commentId: number, comment: string): Observable<TaskComment> {
    const url = `${this.apiUrl}/comments/${commentId}`;
    return this.http.put<TaskComment>(url, { comment });
  }

  // Delete a comment
  deleteTaskComment(commentId: number): Observable<any> {
    const url = `${this.apiUrl}/comments/${commentId}`;
    return this.http.delete(url);
  }
}
