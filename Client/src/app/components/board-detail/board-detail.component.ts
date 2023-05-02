import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Board } from 'src/app/models/board';
import { Task } from 'src/app/models/task';
import { TaskList } from 'src/app/models/taskList';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';

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

  showCreateList: boolean = false;
  showSettings: boolean = false;
  showListDetail: boolean = false;

  @ViewChild('sidebar') sidebar!: ElementRef<any>;

  constructor(private boardService: BoardService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
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

    this.boardService.editBoard(parseInt(this.boardId), this.board.name, this.board.description).subscribe({
      next: (board) => console.log('saved board:', board),
      error: (error: any) => console.error('error editing board:', error)
    })
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

  updateBoard(board: Board) {
    this.board = board;
  }
}