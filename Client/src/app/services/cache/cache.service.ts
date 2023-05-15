import { Injectable } from '@angular/core';
import { Board } from 'src/app/models/board';
import { Task } from 'src/app/models/task';
import { TaskComment } from 'src/app/models/taskComment';
import { TaskList } from 'src/app/models/taskList';

const BOARDS_KEY = 'httpBoardsCache';
const LISTS_KEY = 'httpListsCache';
const TASKS_KEY = 'httpTasksCache';
const COMMENTS_KEY = 'httpCommentsCache';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  
  constructor() { }

  deleteCache(): void {
    localStorage.clear();
  }

  // boards -------------------------------------------------------------------------

  storeBoards(boards: Board[]): void {
    let mapBoards: Map<number, Board> = new Map(JSON.parse(localStorage[BOARDS_KEY]));
    boards.forEach((board) => mapBoards.set(parseInt(board.id), board));
    localStorage[BOARDS_KEY] = JSON.stringify(Array.from(mapBoards.entries()));
  } 

  storeBoard(board: Board): void {
    let mapBoards: Map<number, Board> = new Map(JSON.parse(localStorage[BOARDS_KEY]));
    mapBoards.set(parseInt(board.id), board);
    localStorage[BOARDS_KEY] = JSON.stringify(Array.from(mapBoards.entries()));
  }

  getCachedBoards(): Board[] {
    let mapBoards: Map<number, Board> = new Map(JSON.parse(localStorage[BOARDS_KEY]));
    return Array.from(mapBoards.values());
  }

  getCachedBoardById(id: string): Board | undefined {
    const mapBoards: Map<number, Board> = new Map(JSON.parse(localStorage[BOARDS_KEY]));
    return mapBoards.get(parseInt(id));
  }

  deleteBoard(id: string): void {
    let mapBoards: Map<number, Board> = new Map(JSON.parse(localStorage[BOARDS_KEY]));
    mapBoards.delete(parseInt(id));
    localStorage[BOARDS_KEY] = JSON.stringify(Array.from(mapBoards.entries()));
  }

  // lists --------------------------------------------------------------------------

  storeTaskLists(taskLists: TaskList[]): void {
    let mapLists: Map<number, TaskList> = new Map(JSON.parse(localStorage[LISTS_KEY]));
    taskLists.filter((taskList: TaskList) => this.getCachedBoardById(taskList.board_id.toString()));
    taskLists.forEach((taskList: TaskList) => mapLists.set(parseInt(taskList.id), taskList));
    localStorage[LISTS_KEY] = JSON.stringify(Array.from(mapLists.entries()));
  }

  storeTaskList(taskList: TaskList): void {
    if (!this.getCachedBoardById(taskList.board_id.toString())) return;
    let mapLists: Map<number, TaskList> = new Map(JSON.parse(localStorage[LISTS_KEY]));
    mapLists.set(parseInt(taskList.id), taskList);
    localStorage[LISTS_KEY] = JSON.stringify(Array.from(mapLists.entries()));
  }

  getCachedTaskLists(boardId: string): TaskList[] | undefined {
    if (!this.getCachedBoardById(boardId)) return;
    const mapLists: Map<number, TaskList> = new Map(JSON.parse(localStorage[LISTS_KEY]));
    let lists: TaskList[] = Array.from(mapLists.values());
    lists.filter((taskList: TaskList) => taskList.board_id == parseInt(boardId));
    return lists;
  }

  getCachedTaskListById(id: string): TaskList | undefined {
    const mapLists: Map<number, TaskList> = new Map(JSON.parse(localStorage[LISTS_KEY]));
    return mapLists.get(parseInt(id));
  }

  deleteTaskList(id: string): void {
    const mapLists: Map<number, TaskList> = new Map(JSON.parse(localStorage[LISTS_KEY]));
    mapLists.delete(parseInt(id));
    localStorage[LISTS_KEY] = JSON.stringify(Array.from(mapLists.entries()));
  }

  // tasks --------------------------------------------------------------------------

  storeTasks(tasks: Task[]): void {
    let mapTasks: Map<number, Task> = new Map(JSON.parse(localStorage[TASKS_KEY]));
    tasks.filter((task: Task) => this.getCachedTaskListById(task.tasklist_id.toString()));
    tasks.forEach((task: Task) => mapTasks.set(task.id, task));
    localStorage[TASKS_KEY] = JSON.stringify(Array.from(mapTasks.entries()));
  }

  storeTask(task: Task): void {
    let mapTasks: Map<number, Task> = new Map(JSON.parse(localStorage[TASKS_KEY]));
    mapTasks.set(task.id, task);
    localStorage[TASKS_KEY] = JSON.stringify(Array.from(mapTasks.entries()));
  }

  getCachedTasks(listId: string): Task[] | undefined {
    if (!this.getCachedTaskListById(listId)) return;
    const mapTasks: Map<number, Task> = new Map(JSON.parse(localStorage[TASKS_KEY]));
    let tasks: Task[] = Array.from(mapTasks.values());
    tasks.filter((task: Task) => task.tasklist_id == parseInt(listId));
    return Array.from(mapTasks.values());
  }

  getCachedTaskById(id: number): Task | undefined {
    const mapTasks: Map<number, Task> = new Map(JSON.parse(localStorage[TASKS_KEY]));
    return mapTasks.get(id);
  }

  deleteTask(id: number): void {
    const mapTasks: Map<number, Task> = new Map(JSON.parse(localStorage[TASKS_KEY]));
    mapTasks.delete(id);
    localStorage[TASKS_KEY] = JSON.stringify(Array.from(mapTasks.entries()));
  }

  // comments -----------------------------------------------------------------------

  storeTaskComments(comments: TaskComment[]): void {
    let mapComments: Map<number, TaskComment> = new Map(JSON.parse(localStorage[COMMENTS_KEY]));
    comments.filter((comment: TaskComment) => this.getCachedTaskById(comment.task_id));
    comments.forEach((comment: TaskComment) => mapComments.set(comment.id, comment));
    localStorage[COMMENTS_KEY] = JSON.stringify(Array.from(mapComments.entries()));
  }

  storeTaskComment(comment: TaskComment): void {
    if (!this.getCachedTaskById(comment.task_id)) return;
    let mapComments: Map<number, TaskComment> = new Map(JSON.parse(localStorage[COMMENTS_KEY]));
    mapComments.set(comment.id, comment);
    localStorage[COMMENTS_KEY] = JSON.stringify(Array.from(mapComments.entries()));
  }

  getCachedTaskComments(taskId: number): TaskComment[] | undefined {
    if (!this.getCachedTaskById(taskId)) return;
    const mapComments: Map<number, TaskComment> = new Map(JSON.parse(localStorage[COMMENTS_KEY]));
    let comments: TaskComment[] = Array.from(mapComments.values());
    comments.filter((comment: TaskComment) => comment.task_id == taskId);
    return comments;
  }

  getCachedTaskCommentById(id: number): TaskComment | undefined {
    const mapComments: Map<number, TaskComment> = new Map(JSON.parse(localStorage[COMMENTS_KEY]));
    return mapComments.get(id);
  }

  deleteTaskComment(id: number): void {
    let mapComments: Map<number, TaskComment> = new Map(JSON.parse(localStorage[COMMENTS_KEY]));
    mapComments.delete(id);
    localStorage[COMMENTS_KEY] = JSON.stringify(Array.from(mapComments.entries()));
  }
}