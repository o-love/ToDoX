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
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements Form {  
  
  form: FormGroup;
  
  @Input() selectedState: State | null = null;
  selectedLabels: Label[] = [];
  startDate: Date | null = null;
  dueDate: Date | null = null;

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
  @ViewChild('state') state!: ElementRef<any>;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.form = this.fb.group({
      taskName: ['', [Validators.required, Validators.maxLength(20)]],
      taskDescription: ['', [Validators.required, Validators.maxLength(200)]],
    });
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

  private createTask(taskName: string, taskDescription: string, selectedState: string, startDate: Date, dueDate: Date) {
    if (!this.taskListId || !this.boardId) return;

    this.taskService.createTask(this.boardId, this.taskListId, 
      taskName, taskDescription, selectedState, this.selectedLabels, 
      startDate, dueDate).subscribe({
        next: (task: Task) => {
          this.taskCreated.emit(task);
          console.log(task);
        },
        error: (error) => console.log(error)
    });
  }

  onSubmit() {
    this.resetErrors();
    if (this.checkErrors() || !this.selectedState) return;
  
    let taskName: string = this.form.get('taskName')?.value;
    let taskDescription: string = this.form.get('taskDescription')?.value;
    let selectedState: string = this.selectedState.id.toString();
    let startDate: Date = new Date();
    let dueDate: Date = new Date();
    
    if (this.startDate) startDate = new Date(this.startDate);
    if (this.dueDate) dueDate = new Date(this.dueDate);

    this.createTask(taskName, taskDescription, selectedState, startDate, dueDate);
  }
}