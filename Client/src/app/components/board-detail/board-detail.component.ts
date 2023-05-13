import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Board } from 'src/app/models/board';
import { Task } from 'src/app/models/task';
import { TaskList } from 'src/app/models/taskList';
import { User } from 'src/app/models/user';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';
import { TaskListService } from 'src/app/services/taskList-service/task-list-service.service';
import { UserAuthService } from 'src/app/services/user-auth-service/user-auth.service';

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss']
})
export class BoardDetailComponent implements OnInit {
  board!: Board;
  lists: TaskList[] = [];
  tasks: Task[] = [];

  boardId: string | null = null;
  selectedList: string | null = null;  

  user: User | null = null;
  usersId: {[key: number]: User} = {};

  showCreateList: boolean = false;
  showSettings: boolean = false;
  showListDetail: boolean = false;

  @ViewChild('sidebar') sidebar!: ElementRef<any>;

  constructor(private boardService: BoardService, private taskListService: TaskListService, private route: ActivatedRoute, private router: Router, private userService: UserAuthService) {}

  // ng -----------------------------------------------------------------------------

  ngOnInit(): void {
    this.boardId = this.route.snapshot.paramMap.get('boardId');
    this.selectedList = this.route.snapshot.paramMap.get('listId');

    console.log('board %d list %d', this.boardId, this.selectedList)

    this.getMyUser();
    this.getAllUsers();
    this.getBoard();
    this.getLists();
  }

  // getters ------------------------------------------------------------------------

  private getBoard(): void {
    if (!this.boardId) return;

    console.log('getting board...');
    this.boardService.getBoardById(this.boardId).subscribe({
      next: (board: Board) => {
        this.board = board
        console.log('board retrieved:', board);
      }
    })
  }

  private getLists(): void {
    if (!this.boardId) return;

    this.taskListService.getTaskListsByBoardId(this.boardId).subscribe({
      next: (lists: TaskList[]) => {
        this.lists = lists;
        console.log('lists retrieved:', lists);
        if (this.lists.length > 0 && !this.selectedList) this.selectList(this.lists[0].id);
        else this.selectList(this.selectedList);
      }
    })
  }

  // change after refactoring user-service
  private getMyUser() {
    if (this.userService.isLoggedIn()) {
      this.userService.getMyUser().subscribe({
        next: (user: User) => {
          this.user = user;
          console.log('user retrieved:', user);
        },
        error: (error: any) => console.error('error retrieving user:', error)
      })
    }
  }

  // change after refactoring user-service
  private getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => { 
        console.log('users retrieved:', users);
        for (let user of users) this.usersId[user.id] = user;
      },
      error: (error: any) => console.error('error retrieving all users:', error)
    })
  }

  // selectors ----------------------------------------------------------------------
  
  selectList(list: string | null): void {
    this.selectedList = list;
    if (this.selectedList && this.taskListService.hasCachedTaskList(this.boardId!, this.selectedList)) this.router.navigate(['lists', this.selectedList], { relativeTo: this.route, replaceUrl: true });
    else this.selectedList = null;
    if (!this.selectedList) this.router.navigate(['boards', this.boardId]);
    this.showListDetail = this.selectedList ? true : false;
  }

  // board --------------------------------------------------------------------------

  editBoard(board: Board): void {
    if (!this.boardId) return;

    this.boardService.editBoard(this.boardId, board.name, board.description).subscribe({
      next: (board: any) => {
        this.getBoard()
        console.log('board edited:', board)
      }
    }) 
  }

  // tasklists ----------------------------------------------------------------------

  addList(newList: string) {
    this.getLists();
    this.selectList(newList);
    this.hideModals();
  }

  taskListEdited(): void {
    this.getLists();
  }

  deleteTaskList(tasklist_id: string): void {
    if (!this.boardId) return;

    console.log('deleting tasklist %d...', tasklist_id);
    this.taskListService.deleteTasklist(this.boardId, tasklist_id).subscribe({
      next: () => {
        this.selectList(null);
        console.log('deleted tasklist');
        this.getLists()
      } 
    })
  }

  // toggle -------------------------------------------------------------------------

  toggleSidebar() {
    this.sidebar.nativeElement.classList.toggle('sidebar-closed');
  }

  toggleFill(element: HTMLElement) {
    element.classList.toggle('bi-plus-square');
    element.classList.toggle('bi-plus-square-fill');
  }
  
  // modals -------------------------------------------------------------------------
  
  show(): boolean {
    return this.showCreateList || this.showSettings;
  }

  hideModals() {
    if (this.showCreateList) this.showCreateList = false;
    if (this.showSettings) this.showSettings = false;
  }
  
  openCreateList() {
    this.showCreateList = true;
  }

  openSettings() {
    this.showSettings = true;
  }
}