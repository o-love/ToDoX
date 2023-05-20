import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Label } from 'src/app/models/label';
import { State } from 'src/app/models/state';
import { Task } from 'src/app/models/task';
import { TaskList } from 'src/app/models/taskList';

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
  showStates: boolean = false;

  @Output() openTaskDetail: EventEmitter<number> = new EventEmitter();
  @Output() openCreateTask: EventEmitter<null> = new EventEmitter();
  @Output() openCreateState: EventEmitter<void> = new EventEmitter();

  // ng -----------------------------------------------------------------------------

  ngOnChanges(): void {
    if (this.states) this.states.forEach((state) => {
      this.stateNames[state.id] = state.name;
    });
  }

  // tasks --------------------------------------------------------------------------

  createTask() {
    this.openCreateTask.emit(null);
  }

  viewTask(task: Task) {
    this.openTaskDetail.emit(task.id);
  }

  // modals -------------------------------------------------------------------------
  
  hideModals() {
    if (this.showStates) this.showStates = false;
  }

  openStateList() {
    this.showStates = true;
  }

  // outputs ------------------------------------------------------------------------

  addNewState() {
    this.openCreateState.emit();
  }
}