import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Board } from 'src/app/models/board';
import { Task } from 'src/app/models/task';
import { TaskList } from 'src/app/models/taskList';
import { User } from 'src/app/models/user';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';
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

  boardId = this.route.snapshot.paramMap.get('boardId');
  selectedList: TaskList | null = null;

  user: User | null = null;
  usersId: {[key: number]: User} = {};

  showCreateList: boolean = false;
  showSettings: boolean = false;
  showListDetail: boolean = false;

  @ViewChild('sidebar') sidebar!: ElementRef<any>;

  constructor(private boardService: BoardService, private route: ActivatedRoute, private router: Router, private userService: UserAuthService) {}

  ngOnInit(): void {
    this.getMyUser();
    this.getAllUsers();
    this.getBoard();
    this.getLists();
  }

  getBoard(): void {
    if (this.boardId) {
      this.boardService.getBoard(this.boardId).subscribe(
        (board: Board) => {
          console.log('Board retrieved:', board);
          this.board = board;
        },
        (error: any) => {
          console.error('Error retrieving board:', error);
        }
      );
    }
  }

  getLists(): void {
    if (this.boardId) {
      this.boardService.getTaskListsByBoardId(this.boardId.toString()).subscribe(
        (lists: TaskList[]) => {
          console.log('Lists retrieved:', lists);
          this.lists = lists;
          if (this.lists.length > 0) this.selectList(this.lists[0]);
        },
        (error: any) => {
          console.error('Error retrieving lists:', error);
        }
      );
    }
  }

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

  private getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => { 
        console.log('users retrieved:', users);
        for (let user of users) this.usersId[user.id] = user;
      },
      error: (error: any) => console.error('error retrieving all users:', error)
    })
  }

  closePopup() {
    if (this.showCreateList) this.showCreateList = false;
    if (this.showSettings) this.showSettings = false;
  }

  toggleSidebar() {
    this.sidebar.nativeElement.classList.toggle('sidebar-closed');
  }

  addList(newList: TaskList) {
    this.lists.push(newList);
    this.closePopup();
    this.selectList(newList);
  }

  selectList(list: TaskList | null): void {
    this.selectedList = list;
    if (this.selectedList) {
      this.router.navigate(['lists', this.selectedList.id], { relativeTo: this.route, replaceUrl: true });
      this.showListDetail = true;
    } else {
      this.router.navigate(['boards', this.boardId]);
      this.showListDetail = false;
    }
  }

  deleteTaskList(tasklist_id: number): void {
    let list_index = 0;

    for (let index = 0; index < this.lists.length; index++) {
      if (this.lists[index].id == tasklist_id) {
        this.lists.splice(index, 1);
        list_index = index - 1;   
        break;
      }
    }

    if (list_index >= 0) this.selectList(this.lists[list_index]);
    else this.selectList(null);

    this.boardService.deleteTasklist(this.board.id.toString(), tasklist_id.toString()).subscribe({
      next: () => console.log('deleted list:', tasklist_id),
      error: (error: any) => console.error('Error deleting tasklist:', error)
    });
  }

  editTaskList(taskList: TaskList): void {
    if (!this.selectedList || !this.boardId) return;
    
    for (let list of this.lists) {
      if (list.id == this.selectedList.id) {
        list = taskList;
        break;
      }
    }

    this.boardService.editTasklist(this.boardId, this.selectedList.id.toString(), taskList.name, taskList.description).subscribe({
      next: (taskList: TaskList) => console.log('saved list:', taskList),
      error: (error: any) => console.error('Error editing taskList:', error)
    })
  }

  editBoard(board: Board): void {
    if (!this.boardId) return;

    this.board.name = board.name;
    this.board.description = board.description;

    this.boardService.editBoard(parseInt(this.boardId), board.name, board.description).subscribe(
      () => console.log('board saved:', board),
      (error: any) => console.log(error)
    ) 
  }

  toggleFill(element: HTMLElement) {
    element.classList.toggle('bi-plus-square');
    element.classList.toggle('bi-plus-square-fill');
  }

  openCreateList() {
    this.showCreateList = true;
  }

  openSettings() {
    this.showSettings = true;
  }
}