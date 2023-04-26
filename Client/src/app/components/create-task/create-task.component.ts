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
export class CreateTaskComponent {  
  
  form: FormGroup;
  selectedState: State | null = null;
  selectedLabels: Label[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      taskName: ['', Validators.required],
      taskDescription: ['', []],
      startDate: ['', []],
      dueDate: ['', []],
    })
  }

  onSubmit() {
    
  }
  /*
  form: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService, private route: ActivatedRoute, private router: Router) { 
    this.form = this.fb.group({
      taskName: ['', [Validators.required]],
      taskDescription: ['', []],
      selectedState: ['', [Validators.required]],
      startDate: ['', []],
      dueDate: ['', []],
      labels: ['', []] 
    })
  }

  taskName: string = '';
  taskDescription: string = '';
  startDate: Date | null = null;
  dueDate: Date | null = null;

  selectedState: string = '';
  stateId: string = '';
  states: State[] = [];

  labels: Label[] = [];
  selectedLabels: Label[] = [];

  @Output() taskCreated = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<void>();

  @Input() boardId: string | undefined;
  @Input() taskListId: string | undefined;

  @ViewChildren('required') requiredInputs!: QueryList<ElementRef>;

  ngOnInit() {
    this.getStates();
    this.getLabels();
  }

  checkErrors(): boolean {
    let errors: boolean = false;

    this.requiredInputs.forEach((label, index) => {
      const control = this.form.controls[Object.keys(this.form.controls)[index]];

      if (control.errors) {
        this.onError(label);
        errors = true;
      }
    })

    return errors;
  }

  resetErrors(): void {
    this.requiredInputs.forEach((label) => {
			label.nativeElement.style.boxShadow = 'none';
		});
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

  getStates() {
    if (this.boardId && this.taskListId) {
      this.taskService.getStatesByTaskListId(this.boardId, this.taskListId).subscribe({
        next: (states) => {
          this.states = states;
        },
        error: (error) => console.log(error)
      });
    }
    console.log("states de board", this.boardId, "y list", this.taskListId, "states:", this.states);
  }

  getLabels() {
    this.taskService.getLabels().subscribe(
      (labels: Label[]) => {
        this.labels = labels;
    });
  }

  onSubmit() {
    this.resetErrors();
    if (this.checkErrors()) return;

    if (this.boardId && this.taskListId && this.taskName && this.selectedState) {
      const state = this.states.find(state => state.id === parseInt(this.selectedState));
      if (state) {
        console.log("selectedLabels", this.selectedLabels);
        console.log("selectedDates", this.startDate, this.dueDate);
        this.stateId = state.id.toString();
        this.taskService.createTask(
          this.boardId, this.taskListId, this.taskName, this.taskDescription,
          this.stateId, this.selectedLabels, this.startDate, this.dueDate
        ).subscribe({
          next: (task: Task) => {
            this.taskCreated.emit(task);
            this.taskName = '';
            this.taskDescription = '';
            this.stateId = '';
            this.selectedLabels = [];            
            this.startDate = null;
            this.dueDate = null;
          },
          error: (error) => console.log(error)
        });
      }
    }
  }

  onClose() {
    this.closePopup.emit();
  }*/
}