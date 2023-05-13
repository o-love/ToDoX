import { Injectable } from '@angular/core';
import { State } from '../../models/state';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private apiUrl = 'http://localhost:8082/api';
  private states: Map<string, Map<string, Map<number, State>>> = new Map();

  constructor(private http: HttpClient) {}

  private getCachedStates(boardId: string, listId: string): State[] {
    let lists: any = this.states.has(boardId) ? this.states.get(boardId) : new Map();
    let states: any = lists.has(listId) ? lists.get(listId) : new Map();
    return Array.from(states.values());
  }

  getStatesByTaskListId(boardId: string, listId: string): Observable<State[]> {
    let states: any = this.getCachedStates(boardId, listId);
    console.log('cached states:', states);
    if (states.length > 0) return of(states);

    console.log('GET states...');
    const http = this.http.get<State[]>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/states`); 

    http.subscribe({
      next: (states: State[]) => {
        let mapListStates = this.states.get(boardId);
        if (!mapListStates) mapListStates = new Map();
        let mapStates = mapListStates.get(listId);
        if (!mapStates) mapStates = new Map<number, State>();
        
        states.forEach((state) => mapStates?.set(state.id, state))
        mapListStates.set(listId, mapStates);
        this.states.set(boardId, mapListStates);
      }
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