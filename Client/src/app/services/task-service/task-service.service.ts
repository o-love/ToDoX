import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from 'src/app/models/board';
import { TaskList } from 'src/app/models/taskList';
import { Task } from 'src/app/models/task';
import { State } from 'src/app/models/state';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8082/api/boards';

  constructor(private http: HttpClient) { }

  // Gets all tasks from backend related to a certain list from a certain board
  getTasksByTaskListId(boardId: string, listId: string): Observable<Task[]> {
    const url = `${this.apiUrl}/${boardId}/lists/${listId}/tasks`;
    return this.http.get<Task[]>(url);
  }

  // Gets a task by id, taskList id and board id - REV
  // getTask(boardId: string, listId: string, stateId: string)
  // // Gets a taskList by id and board id
  // getList(boardId: string, listId: string): Observable<TaskList[]> {
  //   return this.http.get<TaskList[]>(`${this.apiUrl}/${boardId}/lists/${listId}`);
  // }

  // Creates a new task in backend related to a taskList related to a board
  createTask(boardId: string, listId: string, taskName: string, taskDescription: string, stateId: string): Observable<Task> {
    const url = `${this.apiUrl}/${boardId}/lists/${listId}/tasks`;
    const task = {
      name: taskName,
      description: taskDescription,
      state_id: stateId,
      taskListId: listId,
    };
    return this.http.post<Task>(url, task);
  }

  // updateTask(boardId: string, listId: string, taskId: string, name: string, description: string): Observable<Task> {
  //   const url = `${this.apiUrl}/${boardId}/lists/${listId}/tasks/${taskId}`;
  //   const task = { name, description };
  //   return this.http.put<Task>(url, task);
  // }

  // deleteTask(boardId: string, listId: string, taskId: string): Observable<any> {
  //   const url = `${this.apiUrl}/${boardId}/lists/${listId}/tasks/${taskId}`;
  //   return this.http.delete(url);
  // }

  getStates(boardId: string, listId: string): Observable<State[]> {
    const url = `${this.apiUrl}/${boardId}/lists/${listId}/states`;
    return this.http.get<State[]>(url);
  }
}
