import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Board } from 'src/app/models/board';
import { Form } from 'src/app/models/form';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';

@Component({
  selector: 'app-board-settings',
  templateUrl: './board-settings.component.html',
  styleUrls: ['./board-settings.component.scss']
})
export class BoardSettingsComponent implements Form, OnInit {

  form: FormGroup;

  @Input() board: Board | null = null; 
  @Output() closeBoardSettings = new EventEmitter<void>();
  @Output() boardEdited = new EventEmitter<Board>();

  @ViewChildren('input') inputs!: QueryList<ElementRef<any>>;
  @ViewChild('savebtn') savebtn!: ElementRef<any>;
  disabled: boolean = true;

  constructor(private fb: FormBuilder, private boardService: BoardService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(60)]],
      description: ['',  [Validators.maxLength(60)]]
    });
  }

  ngOnInit() {
    this.form.setValue({
      name: this.board?.name,
      description: this.board?.description
    })
    this.form.controls['name'].disable();
    this.form.controls['description'].disable();
  }

  checkErrors(): boolean {
    let errors: boolean = false;

    this.inputs.forEach((input, index) => {
      const control = this.form.controls[Object.keys(this.form.controls)[index]];

      if (control.errors) {
        errors = true;
        if (errors) this.onError(input);
      }
    })

    return errors;
  }

  resetErrors(): void {
    this.inputs.forEach((input) => {
			input.nativeElement.style.boxShadow = 'none';
		});
  }

  onError(input: ElementRef<any>): void {
    input.nativeElement.style.boxShadow = '0px 0px 7px rgb(255, 113, 113)';
  }

  onClose() {
    this.closeBoardSettings.emit();
  }

  toggleEdit() {
    this.disabled = !this.disabled;
    if (this.disabled) {
      this.form.controls['name'].disable();
      this.form.controls['description'].disable();
    } else {
      this.form.controls['name'].enable();
      this.form.controls['description'].enable();
    }
  }

  onSubmit() {
    this.resetErrors();
    if (!this.board) return;
    if (!this.checkErrors()) {
      this.boardService.editBoard(this.board.id, this.board.name, this.board.description).subscribe(
        () => {
          if (!this.board) return; 
          this.boardEdited.emit(this.board);
          this.board.name = this.form.get('name')?.value;
          this.board.description = this.form.get('description')?.value;
        },
        (error: any) => console.log(error)
      ) 
    }
    console.log('name:', this.board.name, 'description:', this.board.description);
    this.toggleEdit();
  }
}