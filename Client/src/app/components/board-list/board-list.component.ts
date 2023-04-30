import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Board } from 'src/app/models/board';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit {
  boards: Board[] = [];
  showAddPopup: boolean = false;

  constructor(private boardService: BoardService, private router: Router) { }

  ngOnInit(): void {
    this.getBoards();
  }

  getBoards(): void {
    this.boardService.getBoards().subscribe(
      (boards: Board[]) => {
        console.log('Boards retrieved:', boards);
        this.boards = boards;
      },
      (error: any) => {
        console.error('Error retrieving boards:', error);
      }
    );
  }

  hidePopup() {
    if (this.showAddPopup) this.showAddPopup = false;
  }

  viewBoard(board_id: number) {
    this.router.navigate(['/boards', board_id]);
  }

  addBoard(newBoard: Board) {
    this.boards.push(newBoard);
    this.hidePopup();
  }

  deleteBoard(board_id: number): void {
    this.boardService.deleteBoard(board_id).subscribe(
      () => {
        for (let index = 0; index < this.boards.length; index++) {
          if (this.boards[index].id == board_id) {
            this.boards.splice(index, 1);
            console.log('Deleted board:', board_id);
            break;
          }
        }
      },
      (error: any) => {
        console.error('Error deleting board:', error);
      }
    );
  }

  // THIS WILL BE USED WHEN ADDED EDIT BTN

  /*
  editBoard(id: number): void {
    console.log("Board id edit", id);
    this.boards[id].isEditing = true;
  }

  saveBoardEdit(index: number): void {
    const board = this.boards[index];
    this.boardService.editBoard(board.id, board.name, board.description).subscribe(
      (response) => {
        console.log("Board updated:", response);
        board.isEditing = false;
      },
      (error) => {
        console.error("Error updating board:", error);
      }
    );
  }

  cancelBoardEdit(index: number): void {
    this.boards[index].isEditing = false;
  }*/
}