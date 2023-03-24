import { Component, EventEmitter, Output } from '@angular/core';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';
import { Board } from 'src/app/models/board';

// This component will be responsible for creating boards for a user.

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss']
})

export class CreateBoardComponent {
  constructor(private boardService: BoardService) { }

  boardName: string = '';
  boardDescription: string = '';
  
  @Output() boardCreated = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<void>();

  onSubmit() {
    console.log("board: ", this.boardName, " description: ", this.boardDescription)
    this.boardService.createBoard(this.boardName, this.boardDescription).subscribe({
      next: (board) => {
        this.boardCreated.emit(board);

        this.boardService.getBoards().subscribe((boards: Board[]) => {
          this.boardCreated.emit(board);
        });

        this.boardName = '';
        this.boardDescription = '';
      },
      error: (error) => console.log(error)
    });
  }

  onClose() {
    this.closePopup.emit();
  }
}