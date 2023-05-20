import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from 'src/app/models/form';
import { TaskList } from 'src/app/models/taskList';

@Component({
  selector: 'app-list-settings',
  templateUrl: './list-settings.component.html',
  styleUrls: ['./list-settings.component.scss']
})
export class ListSettingsComponent implements Form, OnChanges {
  form: FormGroup;

  @Input() list: TaskList | null = null; 
  
  @Output() close = new EventEmitter<void>();
  @Output() edited = new EventEmitter<TaskList>();
  @Output() deleted = new EventEmitter<void>();

  @ViewChildren('input') inputs!: QueryList<ElementRef<any>>;
  @ViewChild('savebtn') savebtn!: ElementRef<any>;

  loading: boolean = false;
  timeout: any;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['',  [Validators.maxLength(100)]]
    });
  }

  // ng -----------------------------------------------------------------------------

  ngOnChanges() {
    if (!this.list) return;

    this.form.setValue({
      name: this.list.name,
      description: this.list.description
    })
  }

  // outputs ------------------------------------------------------------------------

  onClose() {
    this.close.emit();
  }

  onDelete(btn: HTMLElement) {
    if (!this.list) return;
    btn.style.backgroundColor = "rgba(255, 113, 113)";
    btn.style.color = "white";
    this.loading = true;
    this.deleted.emit();
  }

  // keys ---------------------------------------------------------------------------

  onKeyUp(event: any) {
    clearTimeout(this.timeout);
    let $this = this;
    this.timeout = setTimeout(function() {
      if (event.keyCode != 13) {
        $this.save();
      }
    }, 1000);
  }

  // forms --------------------------------------------------------------------------

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

  // submit -------------------------------------------------------------------------

  save() {
    this.resetErrors();
    if (!this.checkErrors || !this.list) return;

    console.log('saving...');

    this.list.name = this.form.get('name')?.value;
    this.list.description = this.form.get('description')?.value;

    console.log('new list:', this.list);
    this.edited.emit(this.list);
  }
}