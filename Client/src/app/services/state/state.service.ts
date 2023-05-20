import { Injectable } from '@angular/core';
import { State } from '../../models/state';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  async getStatesByTaskListId(boardId: string, listId: string): Promise<State[]> {
    let states: any = this.cacheService.getCachedStates(listId);
    console.log('cached states:', states);
    if (states && states.length > 0) return new Promise((resolve) => resolve(states));

    console.log('GET states...');
    const http = this.http.get<State[]>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/states`); 

    return await new Promise((resolve) => 
      http.subscribe({
        next: (states: State[]) => {
          this.cacheService.storeStates(states, listId);
          console.log('states retrieved:', states);
          resolve(states);
        },
        error: (err: any) => console.error('error getting states:', err)
      })
    )
  }

  async getStateById(boardId: string, listId: string, stateId: number): Promise<State> {
    let state: any = this.cacheService.getCachedStateById(stateId);
    console.log('cached state:', state);
    if (state) return new Promise((resolve) => resolve(state));

    console.log('GET state...');
    const http = this.http.get<State>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/states/${stateId}`);

    return await new Promise((resolve) => 
      http.subscribe({
        next: (state: State) => {
          this.cacheService.storeState(state, listId);
          console.log('state retrieved:', state);
          resolve(state);
        },
        error: (err: any) => console.error('error getting state by its id:', err)
      })
    );
  }

  async createState(boardId: string, listId: string, name: string): Promise<State> {
    console.log('POST state...');
    const http = this.http.post<State>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/states`, { name: name });

    return await new Promise((resolve) => 
      http.subscribe({
        next: (state: State) => {
          this.cacheService.storeState(state, listId);
          console.log('state created:', state);
          resolve(state);
        },
        error: (err: any) => console.error('error creating a new state:', err)
      })
    );
  }


  async editState(listId: string, stateId: number, name: string): Promise<State> {
    console.log('PUT state...');
    const http = this.http.put<State>(`${this.apiUrl}/states/${stateId}`, { name: name })
  
    return await new Promise((resolve) => 
      http.subscribe({
        next: (state: any) => {
          this.cacheService.storeState(state.state, listId);
          console.log('state edited:', state.state);
          resolve(state.state);
        },
        error: (err: any) => console.error('error updating state:', err)
      })
    )
  }

  async deleteState(stateId: number): Promise<any> {
    console.log('DELETE state...');
    const http = this.http.delete(`${this.apiUrl}/states/${stateId}`);

    return await new Promise((resolve) => 
      http.subscribe({
        next: () => {
          this.cacheService.deleteState(stateId);
          console.log('state deleted');
          resolve(null);
        },
        error: (err: any) => console.error('error deleting a state:', err)
      })
    );
  } 
}