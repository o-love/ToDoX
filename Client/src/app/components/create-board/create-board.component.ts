import { Component, EventEmitter, Output } from '@angular/core';
import { BoardService } from 'src/app/services/board-service/board-service.service';

// This component will be responsible for creating boards for a user.

@Component({
  selector: 'app-create-board',
  templateUrl: './create_board.component.html',
})

export class CreateBoardComponent {
  constructor(private boardService: BoardService) {}

  boardName: string = '';
  boardDescription: string = '';
  @Output() boardCreated = new EventEmitter<any>();

  onSubmit() {
    console.log("board: ", this.boardName, " description: ", this.boardDescription)
    this.boardService.createBoard(this.boardName, this.boardDescription).subscribe({
      next: (board) => {
        this.boardCreated.emit(board);
        this.boardName = '';
        this.boardDescription = '';
      },
      error: (error) => console.log(error)
    });
  }
}