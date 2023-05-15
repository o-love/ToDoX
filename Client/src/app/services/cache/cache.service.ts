import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';
import { Board } from 'src/app/models/board';
import { State } from 'src/app/models/state';
import { Task } from 'src/app/models/task';
import { TaskComment } from 'src/app/models/taskComment';
import { TaskList } from 'src/app/models/taskList';

const USERS_KEY = 'httpUsersCache';
const MYUSER_KEY = 'httpMyUserCache';
const BOARDS_KEY = 'httpBoardsCache';
const LISTS_KEY = 'httpListsCache';
const TASKS_KEY = 'httpTasksCache';
const COMMENTS_KEY = 'httpCommentsCache';
const STATES_KEY = 'httpStatesCache';
const TIME_KEY = 'lastTime';

interface StateList extends State {
  tasklistId: number;
} 


@Injectable({
  providedIn: 'root'
})
export class CacheService {
  
  constructor() { }

  storeLastTime(): void {
    localStorage[TIME_KEY] = new Date();
  }

  getCachedLastTime(): Date {
    return new Date(localStorage[TIME_KEY]);
  }

  deleteCache(): void {
    console.log('deleting...');
    
    let currentTime = new Date();
    let lastTime = this.getCachedLastTime();
    let differenceTime = currentTime.getTime() - lastTime.getTime();
    let differenceInDays = Math.floor(differenceTime / (1000 * 3600 * 24));

    console.log('difference time:', differenceTime);
    console.log('difference in days:', differenceInDays);
    
    if (differenceInDays == 0) if (differenceTime <= (2 * 60 * 60 * 1000)) return;
    localStorage.clear();
    console.log('cached deleted');
  }

  // users --------------------------------------------------------------------------

  storeUsers(users: User[]): void {
    let mapUsers: Map<number, User> = new Map(localStorage[USERS_KEY] ? JSON.parse(localStorage[USERS_KEY]) : '');
    users.forEach((user: User) => mapUsers.set(user.id, user));
    localStorage[USERS_KEY] = JSON.stringify(Array.from(mapUsers.entries()));
  }

  storeUser(user: User): void {
    localStorage[MYUSER_KEY] = JSON.stringify(user);
    let mapUsers: Map<number, User> = new Map(localStorage[USERS_KEY] ? JSON.parse(localStorage[USERS_KEY]) : '');
    mapUsers.set(user.id, user);
    localStorage[USERS_KEY] = JSON.stringify(Array.from(mapUsers.entries()));
  }

  getCachedMyUser(): User | undefined {
    return localStorage[MYUSER_KEY] ? JSON.parse(localStorage[MYUSER_KEY]) : undefined;
  }

  getCachedUsers(): User[] | undefined {
    let mapUsers: Map<number, User> = new Map(localStorage[USERS_KEY] ? JSON.parse(localStorage[USERS_KEY]) : '');
    return Array.from(mapUsers.values());
  }

  getCachedUserById(id: number): User | undefined {
    let mapUsers: Map<number, User> = new Map(localStorage[USERS_KEY] ? JSON.parse(localStorage[USERS_KEY]) : '');
    return mapUsers.get(id);
  }

  deleteMyUser(): void {
    localStorage[USERS_KEY] = '';
  }

  deleteUser(id: number): void {
    let mapUsers: Map<number, User> = new Map(localStorage[USERS_KEY] ? JSON.parse(localStorage[USERS_KEY]) : '');
    mapUsers.delete(id);
    localStorage[USERS_KEY] = JSON.stringify(Array.from(mapUsers.entries()));
  }

  // boards -------------------------------------------------------------------------

  storeBoards(boards: Board[]): void {
    let mapBoards: Map<number, Board> = new Map(localStorage[BOARDS_KEY] ? JSON.parse(localStorage[BOARDS_KEY]) : '');
    boards.forEach((board) => mapBoards.set(parseInt(board.id), board));
    localStorage[BOARDS_KEY] = JSON.stringify(Array.from(mapBoards.entries()));
  } 

  storeBoard(board: Board): void {
    let mapBoards: Map<number, Board> = new Map(localStorage[BOARDS_KEY] ? JSON.parse(localStorage[BOARDS_KEY]) : '');
    mapBoards.set(parseInt(board.id), board);
    localStorage[BOARDS_KEY] = JSON.stringify(Array.from(mapBoards.entries()));
  }

  getCachedBoards(): Board[] {
    let mapBoards: Map<number, Board> = new Map(localStorage[BOARDS_KEY] ? JSON.parse(localStorage[BOARDS_KEY]) : '');
    return Array.from(mapBoards.values());
  }

  getCachedBoardById(id: string): Board | undefined {
    const mapBoards: Map<number, Board> = new Map(localStorage[BOARDS_KEY] ? JSON.parse(localStorage[BOARDS_KEY]) : '');
    return mapBoards.get(parseInt(id));
  }

  deleteBoard(id: string): void {
    let mapBoards: Map<number, Board> = new Map(localStorage[BOARDS_KEY] ? JSON.parse(localStorage[BOARDS_KEY]) : '');
    mapBoards.delete(parseInt(id));
    localStorage[BOARDS_KEY] = JSON.stringify(Array.from(mapBoards.entries()));
  }

  // lists --------------------------------------------------------------------------

  storeTaskLists(taskLists: TaskList[]): void {
    let mapLists: Map<number, TaskList> = new Map(localStorage[LISTS_KEY] ? JSON.parse(localStorage[LISTS_KEY]) : '');
    taskLists.filter((taskList: TaskList) => this.getCachedBoardById(taskList.board_id.toString()));
    taskLists.forEach((taskList: TaskList) => mapLists.set(parseInt(taskList.id), taskList));
    localStorage[LISTS_KEY] = JSON.stringify(Array.from(mapLists.entries()));
  }

  storeTaskList(taskList: TaskList): void {
    if (!this.getCachedBoardById(taskList.board_id.toString())) return;
    let mapLists: Map<number, TaskList> = new Map(localStorage[LISTS_KEY] ? JSON.parse(localStorage[LISTS_KEY]) : '');
    mapLists.set(parseInt(taskList.id), taskList);
    localStorage[LISTS_KEY] = JSON.stringify(Array.from(mapLists.entries()));
  }

  getCachedTaskLists(boardId: string): TaskList[] | undefined {
    if (!this.getCachedBoardById(boardId)) return;
    const mapLists: Map<number, TaskList> = new Map(localStorage[LISTS_KEY] ? JSON.parse(localStorage[LISTS_KEY]) : '');
    let lists: TaskList[] = Array.from(mapLists.values());
    lists.filter((taskList: TaskList) => taskList.board_id == parseInt(boardId));
    return lists;
  }

  getCachedTaskListById(id: string): TaskList | undefined {
    const mapLists: Map<number, TaskList> = new Map(localStorage[LISTS_KEY] ? JSON.parse(localStorage[LISTS_KEY]) : '');
    return mapLists.get(parseInt(id));
  }

  deleteTaskList(id: string): void {
    const mapLists: Map<number, TaskList> = new Map(localStorage[LISTS_KEY] ? JSON.parse(localStorage[LISTS_KEY]) : '');
    mapLists.delete(parseInt(id));
    localStorage[LISTS_KEY] = JSON.stringify(Array.from(mapLists.entries()));
  }

  // tasks --------------------------------------------------------------------------

  storeTasks(tasks: Task[]): void {
    let mapTasks: Map<number, Task> = new Map(localStorage[TASKS_KEY] ? JSON.parse(localStorage[TASKS_KEY]) : '');
    tasks.filter((task: Task) => this.getCachedTaskListById(task.tasklist_id.toString()));
    tasks.forEach((task: Task) => mapTasks.set(task.id, task));
    localStorage[TASKS_KEY] = JSON.stringify(Array.from(mapTasks.entries()));
  }

  storeTask(task: Task): void {
    let mapTasks: Map<number, Task> = new Map(localStorage[TASKS_KEY] ? JSON.parse(localStorage[TASKS_KEY]) : '');
    mapTasks.set(task.id, task);
    localStorage[TASKS_KEY] = JSON.stringify(Array.from(mapTasks.entries()));
  }

  getCachedTasks(listId: string): Task[] | undefined {
    if (!this.getCachedTaskListById(listId)) return;
    const mapTasks: Map<number, Task> = new Map(localStorage[TASKS_KEY] ? JSON.parse(localStorage[TASKS_KEY]) : '');
    let tasks: Task[] = Array.from(mapTasks.values());
    tasks.filter((task: Task) => task.tasklist_id == parseInt(listId));
    return Array.from(mapTasks.values());
  }

  getCachedTaskById(id: number): Task | undefined {
    const mapTasks: Map<number, Task> = new Map(localStorage[TASKS_KEY] ? JSON.parse(localStorage[TASKS_KEY]) : '');
    return mapTasks.get(id);
  }

  deleteTask(id: number): void {
    const mapTasks: Map<number, Task> = new Map(localStorage[TASKS_KEY] ? JSON.parse(localStorage[TASKS_KEY]) : '');
    mapTasks.delete(id);
    localStorage[TASKS_KEY] = JSON.stringify(Array.from(mapTasks.entries()));
  }

  // comments -----------------------------------------------------------------------

  storeTaskComments(comments: TaskComment[]): void {
    let mapComments: Map<number, TaskComment> = new Map(localStorage[COMMENTS_KEY] ? JSON.parse(localStorage[COMMENTS_KEY]) : '');
    comments.filter((comment: TaskComment) => this.getCachedTaskById(comment.task_id));
    comments.forEach((comment: TaskComment) => mapComments.set(comment.id, comment));
    localStorage[COMMENTS_KEY] = JSON.stringify(Array.from(mapComments.entries()));
  }

  storeTaskComment(comment: TaskComment): void {
    if (!this.getCachedTaskById(comment.task_id)) return;
    let mapComments: Map<number, TaskComment> = new Map(localStorage[COMMENTS_KEY] ? JSON.parse(localStorage[COMMENTS_KEY]) : '');
    mapComments.set(comment.id, comment);
    localStorage[COMMENTS_KEY] = JSON.stringify(Array.from(mapComments.entries()));
  }

  getCachedTaskComments(taskId: number): TaskComment[] | undefined {
    if (!this.getCachedTaskById(taskId)) return;
    const mapComments: Map<number, TaskComment> = new Map(localStorage[COMMENTS_KEY] ? JSON.parse(localStorage[COMMENTS_KEY]) : '');
    let comments: TaskComment[] = Array.from(mapComments.values());
    comments.filter((comment: TaskComment) => comment.task_id == taskId);
    return comments;
  }

  getCachedTaskCommentById(id: number): TaskComment | undefined {
    const mapComments: Map<number, TaskComment> = new Map(localStorage[COMMENTS_KEY] ? JSON.parse(localStorage[COMMENTS_KEY]) : '');
    return mapComments.get(id);
  }

  deleteTaskComment(id: number): void {
    let mapComments: Map<number, TaskComment> = new Map(localStorage[COMMENTS_KEY] ? JSON.parse(localStorage[COMMENTS_KEY]) : '');
    mapComments.delete(id);
    localStorage[COMMENTS_KEY] = JSON.stringify(Array.from(mapComments.entries()));
  }

  // states -------------------------------------------------------------------------

  storeStates(states: State[], listId: string): void {
    let mapStates: Map<number, StateList> = new Map(localStorage[STATES_KEY] ? JSON.parse(localStorage[STATES_KEY]) : '');
    states.forEach((state: State) => mapStates.set(state.id, { id: state.id, name: state.name, tasks: state.tasks , tasklistId: parseInt(listId) }));
    localStorage[STATES_KEY] = JSON.stringify(Array.from(mapStates.entries()));
  }

  storeState(state: State, listId: string): void {
    let mapStates: Map<number, StateList> = new Map(localStorage[STATES_KEY] ? JSON.parse(localStorage[STATES_KEY]) : '');
    mapStates.set(state.id, { id: state.id, name: state.name, tasks: state.tasks, tasklistId: parseInt(listId) });
    localStorage[STATES_KEY] = JSON.stringify(Array.from(mapStates.entries()));
  }

  getCachedStates(listId: string): State[] | undefined {
    if (!this.getCachedTaskListById(listId)) return;
    let mapStates: Map<number, StateList> = new Map(localStorage[STATES_KEY] ? JSON.parse(localStorage[STATES_KEY]) : ''); 
    let statesList: StateList[] = Array.from(mapStates.values());
    let states: State[] = [];
    statesList.filter((state: StateList) => state.tasklistId == parseInt(listId));
    statesList.forEach((state: StateList) => states.push(state));
    return states;
  }

  getCachedStateById(id: number): State | undefined {
    let mapStates: Map<number, StateList> = new Map(localStorage[STATES_KEY] ? JSON.parse(localStorage[STATES_KEY]) : ''); 
    return mapStates.get(id);
  }

  deleteState(id: number): void {
    let mapStates: Map<number, StateList> = new Map(localStorage[STATES_KEY] ? JSON.parse(localStorage[STATES_KEY]) : ''); 
    mapStates.delete(id);
    localStorage[STATES_KEY] = mapStates;
  }
}