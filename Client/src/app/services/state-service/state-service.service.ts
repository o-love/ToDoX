import { Injectable } from '@angular/core';
import { State } from '../../models/state';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private states: State[] = [];

  constructor() { }

  getStates(): State[] {
    return this.states;
  }

  getState(id: number): State | undefined {
    return this.states.find(state => state.id === id);
  }

  addState(name: string): void {
    if (this.states.find(state => state.name === name)) {
      throw new Error(`State "${name}" already exists`);
    }
    const id = this.states.length > 0 ? Math.max(...this.states.map(state => state.id)) + 1 : 1;
    this.states.push({ id, name, tasks: [] });
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
}