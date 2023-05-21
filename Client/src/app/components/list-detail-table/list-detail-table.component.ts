import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Label } from 'src/app/models/label';
import { State } from 'src/app/models/state';
import { Task } from 'src/app/models/task';
import { TaskList } from 'src/app/models/taskList';
import { LabelService } from 'src/app/services/label/label.service';

@Component({
  selector: 'app-list-detail-table',
  templateUrl: './list-detail-table.component.html',
  styleUrls: ['./list-detail-table.component.scss']
})
export class ListDetailTableComponent implements OnChanges {

  @Input() selectedList: TaskList | null = null;
  @Input() tasks: Task[] | undefined;
  @Input() states: State[] | undefined;
  @Input() labels: Label[] | undefined;

  stateNames: {[key: number]: string} = {};
  mapLabels: Map<number, Label> = new Map();

  showStates: boolean = false;
  showLabels: boolean = false;

  @Output() openTaskDetail: EventEmitter<number> = new EventEmitter();
  @Output() openCreateTask: EventEmitter<null> = new EventEmitter();
  @Output() openCreateState: EventEmitter<void> = new EventEmitter();
  @Output() openCreateLabel: EventEmitter<void> = new EventEmitter();

  constructor(private labelService: LabelService) {}

  // ng -----------------------------------------------------------------------------

  ngOnChanges(): void {
    if (this.states) this.states.forEach((state) => this.stateNames[state.id] = state.name);
    if (this.labels) this.labels.forEach((label) => this.mapLabels.set(label.id, label));
  }

  // tasks --------------------------------------------------------------------------

  createTask() {
    this.openCreateTask.emit(null);
  }

  viewTask(task: Task) {
    this.openTaskDetail.emit(task.id);
  }

  // labels -------------------------------------------------------------------------

  getLabel(id: number): Label | undefined {
    return this.mapLabels.get(id);
  }

  getColor(key: string | undefined): string | undefined {
    return key ? this.labelService.getColor(key) : undefined;
  }

  // modals -------------------------------------------------------------------------
  
  hideModals() {
    if (this.showStates) this.showStates = false;
    if (this.showLabels) this.showLabels = false;
  }

  openStateList() {
    this.hideModals();
    this.showStates = true;
  }

  openLabelList() {
    this.hideModals();
    this.showLabels = true;
  }

  // outputs ------------------------------------------------------------------------

  addNewState() {
    this.openCreateState.emit();
  }

  addNewLabel() {
    this.openCreateLabel.emit();
  }
}