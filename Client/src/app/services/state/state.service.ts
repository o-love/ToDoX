import { Injectable } from '@angular/core';
import { State } from '../../models/state';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getStatesByTaskListId(boardId: string, listId: string): Observable<State[]> {
    let states: any = this.cacheService.getCachedStates(listId);
    console.log('cached states:', states);
    if (states && states.length > 0) return of(states);

    console.log('GET states...');
    const http = this.http.get<State[]>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/states`); 

    http.subscribe({
      next: (states: State[]) => this.cacheService.storeStates(states, listId),
      error: (err: any) => console.error('error getting states:', err)
    })

    return http;
  }

  // back needs to add a http request for a GET in api/boards/boardId/lists/listId/states/stateId

  // addState(name: string): void {
  //   if (this.states.find(state => state.name === name)) {
  //     throw new Error(`State "${name}" already exists`);
  //   }
  //   const id = this.states.length > 0 ? Math.max(...this.states.map(state => state.id)) + 1 : 1;
  //   this.states.push({ id, name, tasks: [] });
  // }

  // updateState(id: number, name: string): void {
  //   const state = this.getState(id);
  //   if (!state) {
  //     throw new Error(`State with ID ${id} not found`);
  //   }
  //   if (this.states.find(s => s.id !== id && s.name === name)) {
  //     throw new Error(`State "${name}" already exists`);
  //   }
  //   state.name = name;
  // }

  // deleteState(id: number): void {
  //   const stateIndex = this.states.findIndex(state => state.id === id);
  //   if (stateIndex === -1) throw new Error(`State with ID ${id} not found`);
  //   if (this.states[stateIndex].tasks.length > 0) throw new Error(`State with ID ${id} has tasks assigned and cannot be deleted`);
    
  //   this.states.splice(stateIndex, 1);
  // }
}