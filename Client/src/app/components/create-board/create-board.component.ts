import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { BoardService } from 'src/app/services/board/board.service';
import { Board } from 'src/app/models/board';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from 'src/app/models/form';
import { User } from 'src/app/models/user'; // TODO: ELIMINATE AFTER SP1 PRESENTATION
import { UserAuthService } from 'src/app/services/user-auth/user-auth.service'; // TODO: ELIMINATE AFTER SP1 PRESENTATION

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss']
})
export class CreateBoardComponent implements Form {
  form: FormGroup;

  @Output() boardCreated: EventEmitter<void> = new EventEmitter();
  @Output() closePopup: EventEmitter<void> = new EventEmitter();

  @ViewChild('name') name!: ElementRef;

  loading: boolean = false;

  constructor(private boardService: BoardService, private fb: FormBuilder, private userServ: UserAuthService) { 
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    })
  }

  onClose() {
    this.closePopup.emit();
  }

  checkErrors(): boolean {
    if (this.form.controls['name'].errors) {
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

  createBoard() {
    this.resetErrors();
    if (this.checkErrors()) return;

    let name = this.form.value.name;
    let description = this.form.value.description;

    this.loading = true;
    
    console.log('creating board...');
    this.boardService.createBoard(name, description).then(
      (board: any) => {
        console.log('board created:', board);
        this.loading = false;
        this.boardCreated.emit();
      }
    );
  }
}