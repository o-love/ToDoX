import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Label } from 'src/app/models/label';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private apiUrl = 'http://localhost:8082/api';
  private colors: Map<string, string> = new Map([
    ['RED', '#FF5151'],
    ['PINK', '#FFA8D7'],
    ['PURPLE', '#B892FF'],
    ['BLUE', '#52D7E1'],
    ['GREEN', '#70EC87'],
    ['YELLOW', '#FFE46B']
  ])

  constructor(private http: HttpClient, private cacheService: CacheService) { }

  getColorsName(): string[] {
    return Array.from(this.colors.keys());
  }

  getColorsValue(): string[] {
    return Array.from(this.colors.values());
  }

  getColor(key: string): string | undefined {
    return this.colors.get(key);
  }

  async getLabelsByTaskListId(boardId: string, taskListId: string): Promise<Label[]> {
    let labels: any = this.cacheService.getCachedLabels(taskListId);
    console.log('cached labels:', labels);
    if (labels && labels.length > 0) return new Promise((resolve) => resolve(labels));

    console.log('GET labels...');
    const http = this.http.get<Label[]>(`${this.apiUrl}/boards/${boardId}/lists/${taskListId}/labels`);

    return await new Promise((resolve) =>
      http.subscribe({
        next: (labels: Label[]) => {
          this.cacheService.storeLabels(labels, taskListId);
          console.log('labels retrieved:', labels);
          resolve(labels);
        },
        error: (err: any) => console.error('error getting labels by list:', err)
      })
    )
  }

  async getLabelByTaskId(boardId: string, taskListId: string, taskId: number): Promise<Label[]> {
    let labels: any = this.cacheService.getCachedLabelsByTaskId(taskId);
    console.log('cached labels:', labels);
    if (labels && labels.length > 0) return new Promise((resolve) => resolve(labels));

    console.log('GET labels by task...');
    const http = this.http.get<Label[]>(`${this.apiUrl}/boards/${boardId}/lists/${taskListId}/tasks/${taskId}/labels`);

    return await new Promise((resolve) =>
      http.subscribe({
        next: (labels: Label[]) => {
          this.cacheService.storeLabelsByTask(labels, taskListId, taskId);
          console.log('labels retrieved:', labels);
          resolve(labels);
        },
        error: (err: any) => console.error('error getting labels by task:', err)
      })
    )
  } 


  async getLabelById(boardId: string, listId: string, labelId: number): Promise<Label> {
    let label: any = this.cacheService.getCachedLabelById(labelId);
    console.log('cached label:', label);
    if (label) return new Promise((resolve) => resolve(label));

    console.log('GET label...');
    const http = this.http.get<Label>(`${this.apiUrl}/boards/${boardId}/tasks/${listId}/labels/${labelId}`)

    return await new Promise((resolve) => 
      http.subscribe({
        next: (label: Label) => {
          this.cacheService.storeLabel(label, listId);
          console.log('label retrieved:', label);
          resolve(label);
        },
        error: (err: any) => console.error('error getting label by its id:', err)
      })
    )
  }

  async createLabel(boardId: string, taskListId: string, label: any): Promise<Label> {
    console.log('POST label...');
    const http = this.http.post<Label>(`${this.apiUrl}/boards/${boardId}/lists/${taskListId}/labels`, label);

    return await new Promise((resolve) => 
      http.subscribe({
        next: (label: Label) => {
          this.cacheService.storeLabel(label, taskListId);
          console.log('label created:', label);
          resolve(label);
        },
        error: (err: any) => console.error('error creating a new label:', err)
      })
    )
  }

  async editLabel(listId: string, labelId: number, label: any): Promise<Label> {
    console.log('PUT label...');
    const http = this.http.put<Label>(`${this.apiUrl}/labels/${labelId}`, label);

    return await new Promise((resolve) => 
      http.subscribe({
        next: (label: Label) => {
          this.cacheService.storeLabel(label, listId);
          console.log('label edited:', label);
          resolve(label);
        },
        error: (err: any) => console.error('error updating label:', err)
      })
    )
  }

  async deleteLabel(labelId: number): Promise<any> {
    console.log('DELETE label...');
    const http = this.http.delete(`${this.apiUrl}/labels/${labelId}`);

    return await new Promise((resolve) =>
      http.subscribe({
        next: () => {
          this.cacheService.deleteLabel(labelId);
          console.log('label deleted');
          resolve(null);
        },
        error: (err: any) => console.error('error deleting a label:', err)
      })
    )
  }

  // getLabels(boardId: number, taskListId: number): Observable<any> {
  //   const url = `${this.apiUrl}/boards/${boardId}/lists/${taskListId}/labels`;
  //   return this.http.get(url);
  // }

  // createLabel(boardId: number, taskListId: number, label: any): Observable<any> {
  //   const url = `${this.apiUrl}/boards/${boardId}/lists/${taskListId}/labels`;
  //   return this.http.post(url, label);
  // }

  // getLabel(boardId: number, taskId: number, labelId: number): Observable<any> {
  //   const url = `${this.apiUrl}/boards/${boardId}/tasks/${taskId}/labels/${labelId}`;
  //   return this.http.get(url);
  // }

  // updateLabel(labelId: number, label: any): Observable<any> {
  //   const url = `${this.apiUrl}/labels/${labelId}`;
  //   return this.http.put(url, label);
  // }

  // deleteLabel(labelId: number): Observable<any> {
  //   const url = `${this.apiUrl}/labels/${labelId}`;
  //   return this.http.delete(url);
  // }

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