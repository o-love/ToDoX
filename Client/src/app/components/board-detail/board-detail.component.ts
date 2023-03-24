import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Board } from 'src/app/models/board';
import { BoardList } from 'src/app/models/boardList';
import { BoardService } from 'src/app/services/board-service/board-service.service';

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss']
})
export class BoardDetailComponent implements OnInit {
  board: Board | undefined;
  lists: BoardList[] | undefined;
  componentVisible: boolean = true;
  boardId = this.route.snapshot.paramMap.get('id');

  constructor(private boardService: BoardService, private route: ActivatedRoute) { }

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
      this.boardService.getBoardListsByBoardId(this.boardId).subscribe(
        (lists: BoardList[]) => {
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
    this.componentVisible = !this.componentVisible;
  }

  // addList(newBoard: Board) {
  //   this.boards.push(newBoard);
  //   this.showPopup = false;
  //   this.getBoards();
  // }
}