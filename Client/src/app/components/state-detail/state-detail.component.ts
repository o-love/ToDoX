import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from 'src/app/models/form';
import { State } from 'src/app/models/state';

@Component({
  selector: 'app-state-detail',
  templateUrl: './state-detail.component.html',
  styleUrls: ['./state-detail.component.scss']
})
export class StateDetailComponent implements Form {

  form: FormGroup;

  @Input() state: State | null = null;

  @Output() close: EventEmitter<void> = new EventEmitter<void>(); 
  @Output() edited: EventEmitter<State> = new EventEmitter<State>();
  @Output() deleted: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('input') input!: ElementRef;

  timeout: any;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]]
    })
  }

  checkErrors(): boolean {
    const control = this.form.controls['name'];
    if (!control.errors) return false;
    this.onError(this.input)
    return true;
  }

  resetErrors(): void {
    this.input.nativeElement.style.boxShadow = 'none';
  }

  onError(label: ElementRef) {
    label.nativeElement.style.boxShadow = '0px 0px 7px rgb(255, 113, 113)';
  }

  onDelete(): void {
    if (!this.state) return;
    this.deleted.emit(this.state.id);
  }

  onClose(): void {
    this.close.emit();
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

  private save(): void  {
    this.resetErrors();
    if (this.checkErrors() || !this.state) return;

    console.log('saving...');

    this.state.name = this.form.value.name;

    console.log('new state:', this.state);
    this.edited.emit(this.state);
  }
}