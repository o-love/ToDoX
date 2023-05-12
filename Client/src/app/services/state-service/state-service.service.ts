import { Injectable } from '@angular/core';
import { State } from '../../models/state';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private states: State[] = [];
  
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) { }

  // getStates(): State[] {
  //   return this.states;
  // }

  getStatesByTaskListId(boardId: string, listId: string): Observable<State[]> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/states`;
    return this.http.get<State[]>(url);
  }

  getState(id: number): State | undefined {
    return this.states.find(state => state.id === id);
  }

  getStateApi(boardId: number, listId: number, stateId: number): Observable<State> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/states/${stateId}`;
    return this.http.get<State>(url);
  }

  addState(name: string): void {
    if (this.states.find(state => state.name === name)) {
      throw new Error(`State "${name}" already exists`);
    }
    const id = this.states.length > 0 ? Math.max(...this.states.map(state => state.id)) + 1 : 1;
    this.states.push({ id, name, tasks: [] });
  }

  addStateApi(boardId: number, listId: number, name: string): Observable<State> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/states`;
    return this.http.post<State>(url, { name });
  }

  updateState(id: number, name: string): void {
    const state = this.getState(id);
    if (!state) {
      throw new Error(`State with ID ${id} not found`);
    }
    if (this.states.find(s => s.id !== id && s.name === name)) {
      throw new Error(`State "${name}" already exists`);
    }
    state.name = name;
  }

  updateStateApi(stateId: number, name: string):  Observable<State> {
    const url = `${this.apiUrl}/states/${stateId}`;
    return this.http.put<State>(url, { name });
  }

  deleteState(id: number): void {
    const stateIndex = this.states.findIndex(state => state.id === id);
    if (stateIndex === -1) {
      throw new Error(`State with ID ${id} not found`);
    }
    if (this.states[stateIndex].tasks.length > 0) {
      throw new Error(`State with ID ${id} has tasks assigned and cannot be deleted`);
    }
    this.states.splice(stateIndex, 1);
  }

  deleteStateApi(stateId: number): Observable<State> {
    const url = `${this.apiUrl}/states/${stateId}`;
    return this.http.delete<State>(url);
  }
}