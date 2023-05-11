import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaskList } from 'src/app/models/taskList';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  private apiUrl = 'http://localhost:8082/api';

  boardLists: Map<string, string[]> = new Map<string, string[]>();
  lists: Map<string, TaskList> = new Map<string, TaskList>();

  constructor(private http: HttpClient) { }

  // REVISAR STATE IDS. Todas las listas empiezan con el mismo número de stateids... por lo que 
  // se deberían crear state ids base y en esta función habrá que quitar el argumento de stateIds
  // y en la constante lista le atribuimos SIEMPRE los mismos stateIds !!!!!!!!!!!!!!! 

  getTaskListsByBoardId(boardId: string): Observable<TaskList[] | undefined> {
    if (this.boardLists.has(boardId)) {
      let listsId: string[] | undefined = this.boardLists.get(boardId);
      let lists: TaskList[];

      if (listsId) {

      }
    }

    const http = this.http.get<TaskList[]>(`${this.apiUrl}/boards/${boardId}/lists`);
    
    // http.subscribe({
    //   next: (lists: TaskList[]) => {
    //     console.log('lists retrieved:', lists);
    //     this.boardLists.set(boardId, lists);
    //     lists.forEach((list) => {
    //       if (!this.lists.has(list.id)) this.lists.set(list.id, list);
    //     })
    //   },
    //   error: (err: any) => console.error('error retrieving lists by board id:', err)
    // })

    return http;
  }

  // Gets a taskList by id and board id
  getList(boardId: string, taskListId: string): Observable<TaskList> {
    return this.http.get<TaskList>(`${this.apiUrl}/boards/${boardId}/lists/${taskListId}`);
  }

  // Creates a new taskList in backend related to a board by boardId
  createList(boardId: string, listName: string, listDescription: string, stateIds: number[]): Observable<any> {
    const list = {
      name: listName,
      description: listDescription,
      board_id: boardId,
      state_ids: stateIds,
    };
    return this.http.post(`${this.apiUrl}/boards/${boardId}/lists`, list);
  }

  // Updates a tasklist by id and board id
  editTasklist(boardId: string, taskListId: string, name: string, description: string): Observable<TaskList> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${taskListId}`;
    const taskList = { name, description };
    return this.http.put<TaskList>(url, taskList);
  }

  // Deletes a tasklist by id and board id
  deleteTasklist(boardId: string, taskListId: string): Observable<any> {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${taskListId}`;
    return this.http.delete(url);
  }
}
