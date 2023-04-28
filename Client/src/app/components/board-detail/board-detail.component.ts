import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
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
  selectedList!: TaskList;

  showPopup: boolean = false;
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

  hidePopup() {
    if (this.showPopup) this.showPopup = false;
  }

  toggleSidebar() {
    this.sidebar.nativeElement.classList.toggle('sidebar-closed');
  }

  addList(newList: TaskList) {
    this.lists.push(newList);
    this.hidePopup();
    this.selectList(newList);
  }

  selectList(list: TaskList): void {
    this.selectedList = list;
    console.log("seleccionada", list);
    this.showListDetail = true;
    this.router.navigate(['lists', list.id], { relativeTo: this.route, replaceUrl: true });
  }

  deleteTasklist(tasklist_id: number): void {
    this.boardService.deleteTasklist(this.board.id.toString(), tasklist_id.toString()).subscribe(
      () => {
        for (let index = 0; index < this.lists.length; index++) {
          if (this.lists[index].id == tasklist_id) {
            this.lists.splice(index, 1);
            console.log('Deleted list:', tasklist_id);
            break;
          }
        }
      },
      (error: any) => {
        console.error('Error deleting tasklist:', error);
      }
    );
  }

  toggleFill(element: HTMLElement) {
    element.classList.toggle('bi-plus-square');
    element.classList.toggle('bi-plus-square-fill');
  }

  /*
  editTasklist(tasklist_id: number): void {
    console.log("Tasklist id edit", id);
    this.lists[id].isEditing = true;
  }

  saveTasklistEdit(index: number): void {
    const list = this.lists[index];
    if (this.boardId){
      this.boardService.editTasklist(this.board.id.toString(), list.id.toString(), list.name, list.description).subscribe(
        (response) => {
          console.log("Tasklist updated:", response);
          list.isEditing = false;
          this.getLists();
        },
        (error) => {
          console.error("Error updating tasklist:", error);
        }
      );
    }
  }
  
  cancelTasklistEdit(index: number): void {
    this.lists[index].isEditing = false;
  }*/
}