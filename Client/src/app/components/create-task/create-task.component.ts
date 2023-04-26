import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
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
  selectedState: State | null = null;
  selectedLabels: Label[] = [];

  @Input() boardId!: number;
  @Input() taskListId!: number;
  @Input() states: State[] = [];
  @Input() labels: Label[] = [];

  @Output() taskCreated = new EventEmitter<Task>();
  @Output() closePopup = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.form = this.fb.group({
      taskName: ['', Validators.required],
      taskDescription: ['', []],
      startDate: ['', []],
      dueDate: ['', []],
    })
  }

  checkErrors(): boolean {
    throw new Error('Method not implemented.');
  }
  resetErrors(): void {
    throw new Error('Method not implemented.');
  }
  onError(label: ElementRef<any>): void {
    throw new Error('Method not implemented.');
  }
  onFocus(event: any, label: any): void {
    throw new Error('Method not implemented.');
  }
  onBlur(event: any, label: any): void {
    throw new Error('Method not implemented.');
  }

  onClose() {
    this.closePopup.emit();
  }

  onSubmit() {
    if (!this.taskListId || !this.boardId || !this.selectedState) return;

    let taskName: string = this.form.get('taskName')?.value;
    let taskDescription: string = this.form.get('taskDescription')?.value;
    let startDate: Date | null = this.form.get('startDate')?.value;
    let dueDate: Date | null = this.form.get('dueDate')?.value;

    this.taskService.createTask(this.boardId.toString(), this.taskListId.toString(), 
      taskName, taskDescription, this.selectedState.id.toString(), this.selectedLabels, 
      startDate, dueDate).subscribe({
        next: (task: Task) => {
          this.taskCreated.emit(task);
        },
        error: (error) => console.log(error)
    });
  }
}