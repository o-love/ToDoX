import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { State } from 'src/app/models/state';
import { ActivatedRoute, Router } from '@angular/router'
import { TaskService } from 'src/app/services/task/task.service';
import { Task } from 'src/app/models/task';
import { Label } from 'src/app/models/label';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from 'src/app/models/form';
import { StateService } from 'src/app/services/state/state.service';
import { LabelService } from 'src/app/services/label/label.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements Form, OnInit {  

  @Input() stateId: number | null = null; 

  @Output() changes: EventEmitter<void> = new EventEmitter();
  @Output() close: EventEmitter<void> = new EventEmitter();

  boardId = this.route.snapshot.paramMap.get('boardId');
  taskListId = this.route.snapshot.paramMap.get('listId');
  
  states: State[] = [];
  labels: Label[] = [];

  showStates: boolean = false;
  showLabels: boolean = false;

  @ViewChildren('labels') labelsRef!: QueryList<ElementRef>;
  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  @ViewChild('start') start!: ElementRef;
  @ViewChild('state') state!: ElementRef;

  loading: boolean = false;

  form: FormGroup;
  selectedState: State | null = null;
  selectedLabels: Label[] = [];
  startDate: Date = new Date();
  dueDate: Date = new Date();

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private stateService: StateService, private labelService: LabelService, private taskService: TaskService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      periodicity: ['none']
    })
  }

  // ng -----------------------------------------------------------------------------

  ngOnInit(): void {
    this.getStates();
    this.getLabels();
  }

  // getters ------------------------------------------------------------------------

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
    console.log('loading labels of list %d from board %d', this.taskListId, this.boardId);
    this.labelService.getLabelsByTaskListId(this.boardId, this.taskListId).then(
      (labels: Label[]) => this.labels = labels
    )
  }

  // back should do this not front. and this method would reference state service
  private getSelectedState() {
    if (!this.stateId || !this.states) return;
    for (let state of this.states) if (state.id == this.stateId) {
      this.selectedState = state;
      break;
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

  onError(label: ElementRef): void {
    label.nativeElement.style.boxShadow = '0px 0px 7px rgb(255, 113, 113)';
  }

  // modals -------------------------------------------------------------------------
  
  openStates() {
    this.hideModals();
    if (!this.showStates) this.showStates = true;
  }

  openLabels() {
    this.hideModals();
    if (!this.showLabels) this.showLabels = true;
  }

  hideModals() {
    if (this.showStates) this.showStates = false;
    if (this.showLabels) this.showLabels = false;
  }

  // outputs ------------------------------------------------------------------------

  onChanges() {
    this.changes.emit();
  }

  onClose() {
    this.close.emit();
  }

  // selectors ----------------------------------------------------------------------

  selectState(state: State) {
    this.selectedState = state;
  }

  selectLabels(labels: Label[]) {
    this.selectedLabels = labels;
  }

  // tasks --------------------------------------------------------------------------

  private createTask(name: string, description: string, stateId: string, labels: Label[], startDate: Date, dueDate: Date, periodicity: string) {
    if (!this.taskListId || !this.boardId) return;

    this.loading = true;
    this.taskService.createTask(this.boardId, this.taskListId, name, description, stateId, labels, startDate, dueDate, periodicity).then(
      (task: Task) => {
        this.onChanges();
        this.onClose();
      }
    )
  }

  // submit -------------------------------------------------------------------------

  onSubmit() {
    this.resetErrors();
    if (this.checkErrors() || !this.selectedState) return;
  
    let taskName: string = this.form.value.name;
    let taskDescription: string = this.form.value.description;
    let selectedState: string = this.selectedState.id.toString();
    let startDate: Date = new Date();
    let dueDate: Date = new Date();
    
    if (this.startDate) startDate = new Date(this.startDate);
    if (this.dueDate) dueDate = new Date(this.dueDate);

    let taskPeriodicity: string = this.form.value.periodicity;

    this.createTask(taskName, taskDescription, selectedState, this.selectedLabels, startDate, dueDate, taskPeriodicity);
  }
}