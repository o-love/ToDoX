import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TaskComment } from 'src/app/models/taskComment';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class TaskCommentService {
  private apiUrl = 'http://localhost:8082/api';

  // taskComments: Map<number, Map<number, TaskComment>> = new Map();

  constructor(private http: HttpClient, private cacheService: CacheService
    ) {}

  // private setComment(taskId: number, comment: TaskComment) {
  //   let mapComments: any = this.
  //   if (!mapComments) mapComments = new Map();
  //   mapComments.set(comment.id, comment);
  //   this.taskComments.set(taskId, mapComments);
  // }

  // Get task comments from a certain task
  getTaskComments(boardId: number, listId: number, taskId: number): Observable<TaskComment[]> {
    let comments: any = this.cacheService.getCachedTaskComments(taskId);
    console.log('cached comments:', comments);
    if (comments.length > 0) return of(comments);

    const http = this.http.get<TaskComment[]>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}/comments`);
    
    http.subscribe({
      next: (comments: TaskComment[]) => this.cacheService.storeTaskComments(comments),
      error: (err: any) => console.error('error getting comments by task id:', err) 
    })

    return http;
  }

  // Create a task comment for a certain task
  addTaskComment(boardId: number, listId: number, taskId: number, userId: number, content: string): Observable<TaskComment> {
    const http = this.http.post<TaskComment>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}/comments`, { content: content, user_id: userId });

    http.subscribe({
      next: (comment: TaskComment) => this.cacheService.storeTaskComment(comment),
      error: (err: any) => console.error('error creating a task comment:', err)
    })

    return http;
  }

  // Show information from a comment
  getTaskComment(taskId: number, commentId: number): Observable<TaskComment> {
    const comment: any = this.cacheService.getCachedTaskCommentById(commentId);
    console.log('cached comment:', comment);
    if (comment) return of(comment);

    const http = this.http.get<TaskComment>(`${this.apiUrl}/comments/${commentId}`);

    http.subscribe({
      next: (comment: TaskComment) => this.cacheService.storeTaskComment(comment),
      error: (err: any) => console.error('error getting task comment by id:', err)
    })

    return http;
  }

  // Update a comment
  updateTaskComment(taskId: number, commentId: number, comment: string): Observable<TaskComment> {
    const http = this.http.put<TaskComment>(`${this.apiUrl}/comments/${commentId}`, { comment });

    http.subscribe({
      next: (comment: TaskComment) => this.cacheService.storeTaskComment(comment),
      error: (err: any) => console.error('error updating a task comment:', err)
    })

    return http;
  }

  // Delete a comment
  deleteTaskComment(taskId: number, commentId: number): Observable<any> {
    const http = this.http.delete(`${this.apiUrl}/comments/${commentId}`);

    http.subscribe({
      next: () => this.cacheService.deleteTaskComment(commentId),
      error: (err: any) => console.error('error deleting task comment:', err)
    })
    
    return http;
  }
}