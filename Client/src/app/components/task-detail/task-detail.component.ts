import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Form } from 'src/app/models/form';
import { Label } from 'src/app/models/label';
import { State } from 'src/app/models/state';
import { Task } from 'src/app/models/task';
import { User } from 'src/app/models/user';
import { LabelService } from 'src/app/services/label/label.service';
import { StateService } from 'src/app/services/state/state.service';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, Form {

  @Input() taskId: number | null = null;
  
  @Input() usersId: {[key: number]: User} = {}
  @Input() user: User | null = null;

  @Output() edited: EventEmitter<Task> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() changes: EventEmitter<void> = new EventEmitter();
  @Output() close: EventEmitter<void> = new EventEmitter();

  boardId = this.route.snapshot.paramMap.get('boardId');
  taskListId = this.route.snapshot.paramMap.get('listId');

  task: Task | null = null;

  states: State[] = [];
  labels: Label[] = [];

  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  @ViewChild('start') start!: ElementRef;

  form: FormGroup;
  selectedState: State | null = null;
  selectedLabels: Label[] = [];
  startDate: Date | null = null;
  dueDate: Date | null = null;
  recurring_period: string | null = null;

  showStates: boolean = false;

  timeout: any;
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private taskService: TaskService, private labelService: LabelService, private stateService: StateService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  // ng -----------------------------------------------------------------------------
  
  ngOnInit(): void {
    this.getTask();
    this.getStates();
  }

  // getters ------------------------------------------------------------------------

  private getTask() {
    if (!this.boardId || !this.taskListId || !this.taskId) return;
    console.log('loading task %d of list %d from board %d', this.taskId, this.taskListId, this.boardId);
    this.taskService.getTaskById(this.boardId, this.taskListId, this.taskId).then(
      (task: Task) => {
        this.task = task;
        this.startDate = this.task.start_date;
        this.dueDate = this.task.due_date;
        this.recurring_period = this.task.recurring_period;
        this.form.setValue({name: this.task.name, description: this.task.description});
      }
    )
  }

  private getStates() {
    if (!this.boardId || !this.taskListId) return;
    console.log('loading states of list %d from board %d...', this.taskListId, this.boardId);
    this.stateService.getStatesByTaskListId(this.boardId, this.taskListId).then(
      (states: State[]) => { 
        this.states = states;
        this.getSelectedState();
      }
    );
  }
  
  // here should be a getter method for labels when CRUD for labels is done
  private getLabels() {
    if (!this.boardId || !this.taskListId) return;
    console.log('loading labels of list %d from board %d...', this.taskListId, this.boardId);
    this.labelService.getLabelsByTaskListId(this.boardId, this.taskListId).then(
      (labels: Label[]) => {
        this.labels = labels;
        this.getSelectedLabels();
      }
    )
  }

  // back should do this not front. and this method would reference state service
  private getSelectedState() {
    if (!this.task || !this.states) return;
    for (let state of this.states) if (state.id == this.task.state_id) {
      this.selectedState = state;
      break;
    }
  }

  private getSelectedLabels() {
    if (!this.task || this.labels.length == 0) return;
    for (let label of this.labels) {
      // if ()
    }
  }

  // forms --------------------------------------------------------------------------

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
  
  // modals -------------------------------------------------------------------------

  openStates() {
    if (!this.showStates) this.showStates = true;
  }

  closeStates() {
    if (this.showStates) this.showStates = false;
  }

  changeState(state: State) {
    this.selectedState = state;
    this.save();
  }

  // events -------------------------------------------------------------------------

  onClose() {
    this.close.emit();
  }

  onDelete(btn: HTMLElement) {
    if (!this.boardId || !this.taskListId || !this.task) return;
    btn.style.backgroundColor = "rgba(255, 113, 113)";
    btn.style.color = "white";
    this.loading = true;
    this.deleted.emit(this.task.id);
  }

  onChanges() {
    this.getStates();
    this.changes.emit();
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

  // submit -------------------------------------------------------------------------

  save() {
    this.resetErrors();
    if (this.checkErrors() || !this.boardId || !this.taskListId || !this.task) return;

    console.log('saving...');
    
    this.task.name = this.form.get('name')?.value;
    this.task.description = this.form.get('description')?.value;
    if (this.recurring_period) this.task.recurring_period = this.recurring_period || 'none';
    if (this.selectedState) this.task.state_id = this.selectedState.id;
    if (this.startDate) this.task.start_date = new Date(this.startDate);
    if (this.dueDate) this.task.due_date = new Date(this.dueDate);
  
    console.log('new task:', this.task);
    this.edited.emit(this.task);
  }
}