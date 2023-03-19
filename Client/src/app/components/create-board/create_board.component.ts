import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-board',
  templateUrl: './create_board.component.html',
})

export class CreateBoardComponent {
  boardName: string = '';
  boardDescription: string = '';
  @Output() boardCreated = new EventEmitter<any>();

  onSubmit() {
    const board = {
      name: this.boardName,
      description: this.boardDescription,
    };
    this.boardCreated.emit(board);
    this.boardName = '';
    this.boardDescription = '';
  }
}