import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Board } from 'src/app/models/board';
import { Task } from 'src/app/models/task';
import { TaskList } from 'src/app/models/taskList';
import { User } from 'src/app/models/user';
import { BoardService } from 'src/app/services/board/board.service';
import { TaskListService } from 'src/app/services/task-list/task-list.service';
import { UserAuthService } from 'src/app/services/user-auth/user-auth.service';

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

  loading: boolean = false;

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
    this.boardService.getBoardById(this.boardId).then((board: Board) => this.board = board);
  }

  private getLists(): void {
    if (!this.boardId) return;
    this.loading = true;
    console.log('loading taskslits from board %d...', this.boardId);
    this.taskListService.getTaskListsByBoardId(this.boardId).then(
      (lists: TaskList[]) => {
        this.lists = lists;
        this.loading = false;
        if (this.lists.length > 0 && !this.selectedList) this.selectList(this.lists[0].id);
        else this.selectList(this.selectedList);
      }
    )
  }

  // change after refactoring user-service
  private getMyUser() {
    if (this.userService.isLoggedIn()) {
      this.userService.getMyUser().then(
        (user: User) => this.user = user
      )
    }
  }

  // change after refactoring user-service
  private getAllUsers() {
    this.userService.getAllUsers().then(
      (users: User[]) => { for (let user of users) this.usersId[user.id] = user }
    )
  }

  // selectors ----------------------------------------------------------------------
  
  selectList(list: string | null): void {
    this.selectedList = list;
    if (this.selectedList && this.taskListService.hasCachedTaskList(this.selectedList)) this.router.navigate(['/boards/' + this.boardId + '/lists/' + this.selectedList]);
    else this.selectedList = null;
    if (!this.selectedList) this.router.navigate(['boards', this.boardId]);
    this.showListDetail = this.selectedList ? true : false;
  }

  // board --------------------------------------------------------------------------

  editBoard(board: Board): void {
    if (!this.boardId) return;
    console.log('editing board...');
    this.boardService.editBoard(this.boardId, board.name, board.description).then((board: any) => this.getBoard());
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
    this.taskListService.deleteTasklist(this.boardId, tasklist_id).then(
      () => {
        this.selectList(null);
        this.getLists();
      }
    );
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