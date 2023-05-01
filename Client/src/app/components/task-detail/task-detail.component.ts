import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from 'src/app/models/form';
import { State } from 'src/app/models/state';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, Form {

  form: FormGroup;

  @Input() boardId: string | null = null;
  @Input() taskListId: string | null = null;
  @Input() states: State[] | null = null;
  @Input() task: Task | null = null;
  
  selectedState: State | null = null;
  startDate: Date | null = null;
  dueDate: Date | null = null;

  @ViewChildren('input') inputs!: QueryList<ElementRef<any>>;
  @ViewChild('start') start!: ElementRef<any>;

  statesPopup: boolean = false;
  timeout: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() stateChanged = new EventEmitter<string>();
  @Output() deleteTask = new EventEmitter<number>();
  @Output() editTask = new EventEmitter<Task>();

  loading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(200)]]
    })
  }
  
  ngOnInit(): void {
    if (!this.states || !this.task) return; 

    for (let state of this.states) {
      if (state.id == this.task.state_id) {
        this.selectedState = state;
        break;
      }
    }

    this.startDate = this.task.start_date;
    this.dueDate = this.task.due_date;

    this.form.setValue({
      name: this.task.name,
      description: this.task.description
    });
    console.log(this.form.value);
  }

  onClose() {
    this.close.emit();
  }

  onDelete(btn: HTMLElement) {
    if (!this.boardId || !this.taskListId || !this.task) return;
    btn.style.backgroundColor = "rgba(255, 113, 113)";
    btn.style.color = "white";
    this.loading = true;
    this.deleteTask.emit(this.task.id);
  }

  openStates() {
    this.statesPopup = true;
  }

  closeStates() {
    this.statesPopup = false;
  }

  changeState(state: State) {
    this.selectedState = state;
    this.stateChanged.emit(this.selectedState.id.toString());
  }

  checkErrors(): boolean {
    let errors: boolean = false;

    this.inputs.forEach((label, index) => {
      const control = this.form.controls[Object.keys(this.form.controls)[index]];

      if (control.errors) {
        this.onError(label);
        errors = true;
      }
    });

    if (!this.startDate && this.dueDate) {
      this.onError(this.start);
      errors = true;
    }

    return errors;
  }

  resetErrors(): void {
    this.inputs.forEach((label) => {
			label.nativeElement.style.boxShadow = 'none';
		});
    this.start.nativeElement.style.boxShadow = 'none';
  }

  onError(label: ElementRef<any>): void {
    label.nativeElement.style.boxShadow = '0px 0px 7px rgb(255, 113, 113)';
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
    if (this.checkErrors() || !this.boardId || !this.taskListId || !this.task) return;

    console.log('saving...');
    
    this.task.name = this.form.get('name')?.value;
    this.task.description = this.form.get('description')?.value;
    if (this.selectedState) this.task.state_id = this.selectedState.id;
    if (this.startDate) this.task.start_date = new Date(this.startDate);
    if (this.dueDate) this.task.due_date = new Date(this.dueDate);
  
    console.log('new task:', this.task);
    this.editTask.emit(this.task);
  }
}