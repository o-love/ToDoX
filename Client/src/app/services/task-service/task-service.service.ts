import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Task } from 'src/app/models/task';
import { State } from 'src/app/models/state';
import { Label } from 'src/app/models/label';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) { }

  // Gets all tasks from backend related to a certain list from a certain board
  getTasksByTaskListId(boardId: string, listId: string): Observable<Task[]> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks`;
    return this.http.get<Task[]>(url);
  }

  // Gets a task by id, taskList id and board id - REV
  // getTask(boardId: string, listId: string, stateId: string)
  // // Gets a taskList by id and board id
  // getList(boardId: string, listId: string): Observable<TaskList[]> {
  //   return this.http.get<TaskList[]>(`${this.apiUrl}/boards/${boardId}/lists/${listId}`);
  // }

  // Creates a new task in backend related to a taskList related to a board
  createTask(
    boardId: string, listId: string, taskName: string, taskDescription: string,
    stateId: string, selectedLabels: Label[], startDate: Date | null, dueDate: Date | null
  ): Observable<Task> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks`;
    const task = {
      name: taskName,
      description: taskDescription,
      tasklist_id: listId,
      state_id: stateId,
      selectedLabels: selectedLabels,
      start_date: startDate,
      due_date: dueDate
    };
    return this.http.post<Task>(url, task);
  }

  // updateTask(boardId: string, listId: string, taskId: string, name: string, description: string): Observable<Task> {
  //   const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}`;
  //   const task = { name, description };
  //   return this.http.put<Task>(url, task);
  // }

  // deleteTask(boardId: string, listId: string, taskId: string): Observable<any> {
  //   const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}`;
  //   return this.http.delete(url);
  // }

  // Gets all states from a task list related to a board
  getStatesByTaskListId(boardId: string, listId: string): Observable<State[]> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/states`;
    return this.http.get<State[]>(url);
  }

  // Get a state's name from its id
  getStateName(stateId: string): Observable<State> {
    const url = `${this.apiUrl}/states/${stateId}/name`;
    return this.http.get<State>(url);
  }

  // Gets all labels from backend
  getLabels(): Observable<Label[]> {
    const url = `${this.apiUrl}/labels`;
    return this.http.get<Label[]>(url);
  }

  // Creates a new label in backend
  createLabel(labelName: string, labelColor: string, labelDescription: string): Observable<Label> {//, labelType: string): Observable<Label> {
    const label = {
      name: labelName,
      color: labelColor,
      description: labelDescription,
      // type: labelType,
    }
    const url = `${this.apiUrl}/labels`;
    return this.http.post<Label>(url, label);
  }
}
