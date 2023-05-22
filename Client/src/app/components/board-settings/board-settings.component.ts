import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Board } from 'src/app/models/board';
import { Form } from 'src/app/models/form';

@Component({
  selector: 'app-board-settings',
  templateUrl: './board-settings.component.html',
  styleUrls: ['./board-settings.component.scss']
})
export class BoardSettingsComponent implements Form, OnChanges {
  form: FormGroup;

  @Input() board: Board | null = null; 
  @Output() close = new EventEmitter<void>();
  @Output() boardEdited = new EventEmitter<Board>();
  @Output() deleteBoard = new EventEmitter<void>();

  @ViewChildren('input') inputs!: QueryList<ElementRef<any>>;
  @ViewChild('savebtn') savebtn!: ElementRef<any>;

  timeout: any;
  loading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['',  [Validators.maxLength(100)]]
    });
  }

  ngOnChanges() {
    if (!this.board) return;

    this.form.setValue({
      name: this.board.name,
      description: this.board.description
    })
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
    this.close.emit();
  }

  onDelete(btn: HTMLElement) {
    if (!this.board) return;
    btn.style.backgroundColor = "rgba(255, 113, 113)";
    btn.style.color = "white";
    this.loading = true;
    this.deleteBoard.emit();
  }

  onKeyUp(event: any) {
    clearTimeout(this.timeout);
    let $this = this;
    this.timeout = setTimeout(function() {
      if (event.keyCode != 13) {
        $this.save();
      }
    }, 1000);
  }

  save() {
    this.resetErrors();
    if (this.checkErrors() || !this.board) return;

    console.log('saving...');

    this.board.name = this.form.get('name')?.value;
    this.board.description = this.form.get('description')?.value;

    console.log('new board:', this.board);
    this.boardEdited.emit(this.board);
  }
}