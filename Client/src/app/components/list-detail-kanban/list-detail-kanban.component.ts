import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Label } from 'src/app/models/label';
import { State } from 'src/app/models/state';
import { Task } from 'src/app/models/task';
import { TaskList } from 'src/app/models/taskList';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list-detail-kanban',
  templateUrl: './list-detail-kanban.component.html',
  styleUrls: ['./list-detail-kanban.component.scss']
})
export class ListDetailKanbanComponent implements OnChanges {

  @Input() selectedList: TaskList | null = null;
  @Input() tasks: Task[] | undefined;
  @Input() states: State[] | undefined;
  @Input() labels: Label[] | undefined;

  @Output() taskDragged: EventEmitter<number | null> = new EventEmitter();
  @Output() edited: EventEmitter<Task> = new EventEmitter();

  @Output() editedState: EventEmitter<State> = new EventEmitter();
  @Output() deletedState: EventEmitter<void> = new EventEmitter();

  @Output() openTaskDetail: EventEmitter<number> = new EventEmitter();
  @Output() openCreateTask: EventEmitter<number> = new EventEmitter();
  @Output() openCreateState: EventEmitter<void> = new EventEmitter();

  stateTasks: { [key: number]: Task[] } = {};
  selectedState: State | null = null;
  draggingTask: Task | null = null;

  // ng -----------------------------------------------------------------------------

  ngOnChanges(): void {
    this.updateStates();
  }

  // update -------------------------------------------------------------------------

  updateStates() {
    if (!this.states || !this.tasks) return;

    this.states.forEach((state) => {
      let tasks: Task[] = [];

      if (this.tasks) this.tasks.forEach((task) => {
        if (task.state_id == state.id) tasks.push(task);
      });

      this.stateTasks[state.id] = tasks;
    })

    this.initializeAllStateListOrdering();
  }

  private initializeAllStateListOrdering() {
    for (let stateTasksKey in this.stateTasks) {
      this.stateTasks[stateTasksKey].sort((a, b) => {
        return b.state_position - a.state_position;
      });
    }
  }

  private updateStateListOrdering(state_id: number) {
    this.stateTasks[state_id].forEach((task, index) => {
      index = this.stateTasks[state_id].length - index - 1;
      if (task.state_position !== index) {
        task.state_position = index;
        this.edited.emit(task);
      }
    })
  }

  // drag and drop ------------------------------------------------------------------

  onDragEntered(task: Task) {
    this.draggingTask = task;
  }

  drop(event: CdkDragDrop<Task[]>, state_id: number) {
    if (event.previousContainer === event.container) moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    else transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  
    if (!this.draggingTask) return;

    this.draggingTask.state_id = state_id;
    this.editTask(this.draggingTask);
    this.draggingTask = null;

    this.updateStateListOrdering(state_id);
  }

  // tasks output -------------------------------------------------------------------

  private editTask(task: Task) {
    this.taskDragged.emit(task.id);
    this.edited.emit(task);
  }

  // states output ------------------------------------------------------------------

  editState(state: State) {
    this.editedState.emit(state);
  }

  deleteState() {
    this.deletedState.emit();
  }

  // modals output ------------------------------------------------------------------
 
  viewTask(task: Task) {
    this.openTaskDetail.emit(task.id);
  }

  createTask(state: State) {
    this.openCreateTask.emit(state.id);
  }

  createState() {
    this.openCreateState.emit();
  }

  // events -------------------------------------------------------------------------

  selectState(state: State | null) {
    this.selectedState = state;
  }
}