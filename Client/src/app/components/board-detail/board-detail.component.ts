import { Component, OnInit } from '@angular/core';
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
  board: Board | undefined;
  lists: TaskList[] = [];
  tasks: Task[] = [];

  boardId = this.route.snapshot.paramMap.get('boardId'); //  string = '';
  selectedList: TaskList | undefined;

  sidebarVisible: boolean = true;
  showPopup: boolean = false;
  showListDetail: boolean = false;

  constructor(private boardService: BoardService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // const state = history.state;
    // this.boardId = state.boardId;
    console.log("boardid", this.boardId);
    this.getBoard();
    this.getLists();
    // this.route.paramMap.subscribe(params => {
    //   this.boardId = params.get('boardId');
    //   const listId = params.get('listId');
    //   if (listId) {
    //     this.showListDetail = true;
    //     this.getList(listId);
    //   } else {
    //     this.getBoard();
    //     this.getLists();
    //   }
    // });
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
    this.selectedList = list;
    console.log("seleccionada", list);
    this.showListDetail = true;
    this.router.navigate(['lists', list.id], { relativeTo: this.route, replaceUrl: true });
  }
}