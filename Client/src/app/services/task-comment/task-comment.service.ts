import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TaskComment } from 'src/app/models/taskComment';

@Injectable({
  providedIn: 'root'
})
export class TaskCommentService {
  private apiUrl = 'http://localhost:8082/api';

  taskComments: Map<number, Map<number, TaskComment>> = new Map();

  constructor(private http: HttpClient) {}

  private setComment(taskId: number, comment: TaskComment) {
    let mapComments = this.taskComments.get(taskId);
    if (!mapComments) mapComments = new Map();
    mapComments.set(comment.id, comment);
    this.taskComments.set(taskId, mapComments);
  }

  // Get task comments from a certain task
  getTaskComments(boardId: number, listId: number, taskId: number): Observable<TaskComment[]> {
    const mapComments = this.taskComments.get(taskId);
    if (mapComments) return of(Array.from(mapComments.values()));

    const http = this.http.get<TaskComment[]>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}/comments`);
    
    http.subscribe({
      next: (comments: TaskComment[]) => {
        let mapComments = this.taskComments.get(taskId);
        if (!mapComments) mapComments = new Map();
        comments.forEach((comment) => mapComments?.set(comment.id, comment));
        this.taskComments.set(taskId, mapComments);
      }
    })

    return http;
  }

  // Create a task comment for a certain task
  addTaskComment(boardId: number, listId: number, taskId: number, userId: number, content: string): Observable<TaskComment> {
    const http = this.http.post<TaskComment>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}/comments`, { content: content, user_id: userId });

    http.subscribe({
      next: (comment: TaskComment) => this.setComment(taskId, comment)
    })

    return http;
  }

  // Show information from a comment
  getTaskComment(taskId: number, commentId: number): Observable<TaskComment> {
    const comment = this.taskComments.get(taskId)?.get(commentId);
    if (comment) return of(comment);

    const http = this.http.get<TaskComment>(`${this.apiUrl}/comments/${commentId}`);

    http.subscribe({
      next: (comment: TaskComment) => this.setComment(taskId, comment)
    })

    return http;
  }

  // Update a comment
  updateTaskComment(taskId: number, commentId: number, comment: string): Observable<TaskComment> {
    const http = this.http.put<TaskComment>(`${this.apiUrl}/comments/${commentId}`, { comment });

    http.subscribe({
      next: (comment: TaskComment) => this.setComment(taskId, comment)
    })

    return http;
  }

  // Delete a comment
  deleteTaskComment(taskId: number, commentId: number): Observable<any> {
    const http = this.http.delete(`${this.apiUrl}/comments/${commentId}`);

    http.subscribe({
      next: () => {
        let mapComments = this.taskComments.get(taskId);
        if (!mapComments) mapComments = new Map();
        else mapComments.delete(commentId);
        this.taskComments.set(taskId, mapComments);
      }
    })
    
    return http;
  }
}
