import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { State } from 'src/app/models/state';
import { ActivatedRoute, Router } from '@angular/router'
import { TaskService } from 'src/app/services/task-service/task-service.service';
import { Task } from 'src/app/models/task';
import { Label } from 'src/app/models/label';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from 'src/app/models/form';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
  animations: [
    trigger('transitionMessages', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.5s', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CreateTaskComponent implements Form {  
  
  form: FormGroup;
  
  @Input() selectedState: State | null = null;
  selectedLabels: Label[] = [];

  @Input() boardId: string | null = null;
  @Input() taskListId: string | null = null;
  @Input() states: State[] = [];
  @Input() labels: Label[] = [];

  @Output() taskCreated = new EventEmitter<Task>();
  @Output() closePopup = new EventEmitter<void>();

  statesPopup: boolean = false;
  labelsPopup: boolean = false;

  @ViewChildren('labels') labelsRef!: QueryList<ElementRef<any>>;
  @ViewChildren('input') inputs!: QueryList<ElementRef<any>>;
  @ViewChild('start') start!: ElementRef<any>;
  @ViewChild('due') due!: ElementRef<any>;
  @ViewChild('state') state!: ElementRef<any>;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.form = this.fb.group({
      taskName: ['', [Validators.required, Validators.maxLength(20)]],
      taskDescription: ['', [Validators.maxLength(200)]],
      startDate: ['', []],
      dueDate: ['', []],
    })
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

    if (!this.form.get('startDate') && this.form.get('dueDate')) {
      this.onError(this.start);
      errors = true;
    } else {
      let startDate: Date = new Date(this.form.get('startDate')?.value);
      let dueDate: Date = new Date(this.form.get('dueDate')?.value);

      if (startDate > dueDate) {
        this.onError(this.start);
        this.onError(this.due);
        errors = true;
      }
    }

    if (!this.selectedState) {
      this.onError(this.state);
      errors = true;
    }

    return errors;
  }

  resetErrors(): void {
    this.labelsRef.forEach((label) => {
			label.nativeElement.style.boxShadow = 'none';
		});
  }

  onError(label: ElementRef<any>): void {
    label.nativeElement.style.boxShadow = '0px 0px 7px rgb(255, 113, 113)';
  }

  toggleLabels() {
    if (this.labelsPopup) this.labelsPopup = false;
    else this.labelsPopup = true;
  }

  toggleStates() {
    if (this.statesPopup) this.statesPopup = false;
    else this.statesPopup = true;
  }

  onClose() {
    this.closePopup.emit();
  }

  selectState(state: State) {
    this.selectedState = state;
  }

  selectLabels(labels: Label[]) {
    this.selectedLabels = labels;
  }

  onSubmit() {
    this.resetErrors();
    if (this.checkErrors()) return;
    if (!this.taskListId || !this.boardId || !this.selectedState) {
      console.log('me muero');
      if (!this.taskListId) console.log('tasklist');
      if (!this.boardId) console.log('board');
      if (!this.selectedState) console.log('state');
      return;
    }

    console.log('holii');

    let taskName: string = this.form.get('taskName')?.value;
    let taskDescription: string = this.form.get('taskDescription')?.value;
    let startDate: Date = new Date(this.form.get('startDate')?.value);
    let dueDate: Date = new Date(this.form.get('dueDate')?.value);

    this.taskService.createTask(this.boardId, this.taskListId, 
      taskName, taskDescription, this.selectedState.id.toString(), this.selectedLabels, 
      startDate, dueDate).subscribe({
        next: (task: Task) => {
          this.taskCreated.emit(task);
          console.log(task);
        },
        error: (error) => console.log(error)
    });
  }
}