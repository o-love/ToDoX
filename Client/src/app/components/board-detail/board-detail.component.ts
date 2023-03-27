import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Board } from 'src/app/models/board';
import { TaskList } from 'src/app/models/taskList';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss']
})
export class BoardDetailComponent implements OnInit {
  board: Board | undefined;
  lists: TaskList[] = [];
  boardId = this.route.snapshot.paramMap.get('id');
  selectedList: TaskList | undefined;

  sidebarVisible: boolean = true;
  showPopup: boolean = false;
  showListDetail: boolean = false;

  constructor(private boardService: BoardService, private route: ActivatedRoute ) { }

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
      this.boardService.getTaskListsByBoardId(this.boardId).subscribe(
        (lists: TaskList[]) => {
          console.log('Lists retrieved:', lists);
          this.lists = lists;
        },
        (error: any) => {
          console.error('Error retrieving lists:', error);
        }
      );
    }
  }

  toggleComponent(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  addList(newList: TaskList) {
    this.lists.push(newList);
    this.showPopup = false;
    this.getLists();
  }

  selectList(list: TaskList): void {
    console.log("seleccionada");
    this.selectedList = list;
    this.showListDetail = true;
  }
}