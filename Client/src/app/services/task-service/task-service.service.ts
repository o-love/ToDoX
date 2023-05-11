import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Task } from 'src/app/models/task';
import { Label } from 'src/app/models/label';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8082/api';

  tasks: Map<string, Map<string, Map<number, Task>>> = new Map();

  constructor(private http: HttpClient) {}

  private setTask(boardId: string, listId: string, task: Task) {
    let mapListTasks = this.tasks.get(boardId);
    if (!mapListTasks) mapListTasks = new Map();
    let mapTasks = mapListTasks.get(listId);
    if (!mapTasks) mapTasks = new Map<number, Task>();
    
    mapTasks.set(task.id, task);
    mapListTasks.set(listId, mapTasks);
    this.tasks.set(boardId, mapListTasks);
  }

  getTasksByTaskListId(boardId: string, listId: string): Observable<Task[]> {
    const mapTasks = this.tasks.get(boardId)?.get(listId);
    if (mapTasks) return of(Array.from(mapTasks.values()));

    let http = this.http.get<Task[]>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks`);

    http.subscribe({
      next: (tasks: Task[]) => {
        let mapListTasks = this.tasks.get(boardId);
        if (!mapListTasks) mapListTasks = new Map();
        let mapTasks = mapListTasks.get(listId);
        if (!mapTasks) mapTasks = new Map<number, Task>();
        
        tasks.forEach((task) => mapTasks?.set(task.id, task))
        mapListTasks.set(listId, mapTasks);
        this.tasks.set(boardId, mapListTasks);
      }
    })

    return http;
  }

  getTaskById(boardId: string, listId: string, taskId: number): Observable<Task> {
    const task = this.tasks.get(boardId)?.get(listId)?.get(taskId);
    if (task) return of(task);
    
    const http = this.http.get<Task>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}`);

    http.subscribe({
      next: (task: Task) => this.setTask(boardId, listId, task)
    })

    return http;
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
    const http = this.http.post<Task>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks`, {
        name: taskName,
        description: taskDescription,
        tasklist_id: listId,
        state_id: stateId,
        selectedLabels: selectedLabels,
        start_date: startDate,
        due_date: dueDate
    });

    http.subscribe({
      next: (task: Task) => this.setTask(boardId, listId, task)
    })
    
    return http;
  }

  // Updates a task by id, list id and board id - REV opt with createTask
  editTask(
    boardId: string, listId: string, taskId: string, taskName: string, taskDescription: string,
    stateId: string, selectedLabels: Label[], startDate: Date | null, dueDate: Date | null
  ): Observable<Task> {
    const http = this.http.put<Task>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}`, {
      name: taskName,
      description: taskDescription,
      state_id: stateId,
      selectedLabels: selectedLabels,
      start_date: startDate,
      due_date: dueDate
    });

    http.subscribe({
      next: (task: Task) => this.setTask(boardId, listId, task)
    })

    return http;
  }

  // Deletes a tasklist by id, list id and board id
  deleteTask(boardId: string, listId: string, taskId: number): Observable<any> {
    const http = this.http.delete(`${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}`);

    http.subscribe({
      next: () => {
        let mapListTasks = this.tasks.get(boardId);
        if (!mapListTasks) mapListTasks = new Map();
        
        let mapTasks = mapListTasks.get(listId);
        if (!mapTasks) mapTasks = new Map();
        else mapTasks.delete(taskId);
        
        mapListTasks.set(listId, mapTasks);
        this.tasks.set(boardId, mapListTasks);
      }
    })

    return http;
  }

  // // Get a state's name from its id
  // getStateName(stateId: string): Observable<State> {
  //   const url = `${this.apiUrl}/tasks/${stateId}/name`;
  //   return this.http.get<State>(url);
  // }

  // // Gets all labels from backend
  // getLabels(): Observable<Label[]> {
  //   const url = `${this.apiUrl}/labels`;
  //   return this.http.get<Label[]>(url);
  // }

  // // Creates a new label in backend
  // createLabel(labelName: string, labelColor: string, labelDescription: string): Observable<Label> {//, labelType: string): Observable<Label> {
  //   const label = {
  //     name: labelName,
  //     color: labelColor,
  //     description: labelDescription,
  //     // type: labelType,
  //   }
  //   const url = `${this.apiUrl}/labels`;
  //   return this.http.post<Label>(url, label);
  // }

  // // Changes the state of a task
  // changeTaskState(boardId: string, listId: string, taskId: string, stateId: string): Observable<Task> {
  //   const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/tasks/${taskId}/state`;
  //   const body = { state_id: stateId };
  //   return this.http.put<Task>(url, body);
  // }
}
