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
  @Input() tasks!: Task[];
  @Input() states!: State[];
  @Input() labels!: Label[];

  @Output() taskDragged: EventEmitter<number | null> = new EventEmitter();
  @Output() edited: EventEmitter<Task> = new EventEmitter();

  @Output() openTaskDetail: EventEmitter<number> = new EventEmitter();
  @Output() openCreateTask: EventEmitter<number> = new EventEmitter();

  stateTasks: { [key: number]: Task[] } = {};
  draggingTask: Task | null = null;

  // ng -----------------------------------------------------------------------------

  ngOnChanges(): void {
    this.updateStates();
  }

  // update -------------------------------------------------------------------------

  updateStates() {
    this.states.forEach((state) => {
      let tasks: Task[] = [];

      this.tasks.forEach((task) => {
        if (task.state_id == state.id) tasks.push(task);
      });

      this.stateTasks[state.id] = tasks;
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
  }

  // tasks output -------------------------------------------------------------------

  private editTask(task: Task) {
    this.taskDragged.emit(task.id);
    this.edited.emit(task);
  }

  // modals output ------------------------------------------------------------------
 
  viewTask(task: Task) {
    this.openTaskDetail.emit(task.id);
  }

  createTask(state: State) {
    this.openCreateTask.emit(state.id);
  }
}