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
  @Input() tasks!: Task[];
  @Input() states!: State[];
  @Input() labels!: Label[];

  stateNames: {[key: number]: string} = {};
  showPopup: boolean = false; 

  @Output() openTaskDetail: EventEmitter<number> = new EventEmitter();
  @Output() openCreateTask: EventEmitter<null> = new EventEmitter();

  // ng -----------------------------------------------------------------------------

  ngOnChanges(): void {
    this.states.forEach((state) => {
      this.stateNames[state.id] = state.name;
    });
  }

  // tasks --------------------------------------------------------------------------

  createTask() {
    this.openCreateTask.emit(null);
  }

  editTask(task: Task) {
    this.openTaskDetail.emit(task.id);
  }
}