import { Injectable } from '@angular/core';
import { State } from '../../models/state';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private states: Map<string, Map<string, Map<number, State>>> = new Map();
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) { }

  getStatesByTaskListId(boardId: string, listId: string): Observable<State[]> {
    const states = this.states.get(boardId)?.get(listId);
    if (states) return of(Array.from(states.values()));

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