import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';
import { Board } from 'src/app/models/board';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from 'src/app/models/form';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss']
})
export class CreateBoardComponent implements Form {
  form: FormGroup;

  @ViewChild('name') name!: ElementRef<any>; 

  constructor(private boardService: BoardService, private fb: FormBuilder) { 
    this.form = this.fb.group({
      boardName: ['', Validators.required],
      boardDescription: ['']
    })
  }

  boardName: string = '';
  boardDescription: string = '';
  
  @Output() boardCreated = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<void>();

  onClose() {
    this.closePopup.emit();
  }

  checkErrors(): boolean {
    if (this.form.controls['boardName'].errors) {
      this.onError(this.name);
      return true;
    }  
    return false;
  }

  resetErrors(): void {
    this.name.nativeElement.style.boxShadow = 'none';
  }
  
  onError(label: ElementRef) {
    label.nativeElement.style.boxShadow = '0px 0px 7px rgba(255, 113, 113, 0.7)';
  }

  onFocus(event: any, label: any) {
    label.classList.add('focused');
  }

  onBlur(event: any, label: any) {
    if (!event.target.value) label.classList.remove('focused');
  }

  onSubmit() {
    console.log("board: ", this.boardName, " description: ", this.boardDescription);
    this.resetErrors();
    if (this.checkErrors()) return;
    
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
}