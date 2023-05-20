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

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  // Get task comments from a certain task
  async getTaskComments(boardId: number, listId: number, taskId: number): Promise<TaskComment[]> {
    let comments: any = this.cacheService.getCachedTaskComments(taskId);
    console.log('cached comments:', comments);
    if (comments.length > 0) return new Promise((resolve) => resolve(comments));

    console.log('GET task comments from task %d...', taskId);
    const http = this.http.get<TaskComment[]>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}/comments`);
    
    return await new Promise((resolve) =>
      http.subscribe({
        next: (comments: TaskComment[]) => {
          this.cacheService.storeTaskComments(comments);
          console.log('task comment retrieved:', comments);
          resolve(comments);
        },
        error: (err: any) => console.error('error getting comments by task id:', err) 
      })
    );
  }

  // Create a task comment for a certain task
  async addTaskComment(boardId: number, listId: number, taskId: number, userId: number, content: string): Promise<TaskComment> {
    console.log('POST task comment in task %d...', taskId);
    const http = this.http.post<TaskComment>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}/comments`, { content: content, user_id: userId });
    
    return await new Promise((resolve) => 
      http.subscribe({
        next: (comment: TaskComment) => {
          this.cacheService.storeTaskComment(comment);
          console.log('comment created:', comment);
          resolve(comment);
        },
        error: (err: any) => console.error('error creating a task comment:', err)
      })
    );
  }

  // Show information from a comment
  async getTaskComment(taskId: number, commentId: number): Promise<TaskComment> {
    const comment: any = this.cacheService.getCachedTaskCommentById(commentId);
    console.log('cached comment:', comment);
    if (comment) return new Promise((resolve) => resolve(comment));

    console.log('GET task comment %d from task %d...', commentId, taskId);
    const http = this.http.get<TaskComment>(`${this.apiUrl}/comments/${commentId}`);

    return await new Promise((resolve) =>
      http.subscribe({
        next: (comment: TaskComment) => {
          this.cacheService.storeTaskComment(comment);
          console.log('comment retrieved:', comment);
          resolve(comment);
        },
        error: (err: any) => console.error('error getting task comment by id:', err)
      })
    );
  }

  // Update a comment
  updateTaskComment(taskId: number, commentId: number, comment: string): Observable<TaskComment> {
    console.log('PUT task comment %d from task %d...', commentId, taskId);
    const http = this.http.put<TaskComment>(`${this.apiUrl}/comments/${commentId}`, { comment });

    http.subscribe({
      next: (comment: TaskComment) => this.cacheService.storeTaskComment(comment),
      error: (err: any) => console.error('error updating a task comment:', err)
    })

    return http;
  }

  // Delete a comment
  deleteTaskComment(taskId: number, commentId: number): Observable<any> {
    console.log('DELETE task comment %d from task %d...', commentId, taskId);
    const http = this.http.delete(`${this.apiUrl}/comments/${commentId}`);

    http.subscribe({
      next: () => this.cacheService.deleteTaskComment(commentId),
      error: (err: any) => console.error('error deleting task comment:', err)
    })
    
    return http;
  }
}