import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Label } from 'src/app/models/label';
import { State } from 'src/app/models/state';
import { Task } from 'src/app/models/task';
import { TaskList } from 'src/app/models/taskList';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { isContinueStatement } from 'typescript';
import { state } from '@angular/animations';
import { TaskService } from 'src/app/services/task-service/task-service.service';

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

  @Output() taskDragged = new EventEmitter<Task | null>();
  @Output() taskEdited = new EventEmitter<Task>();
  @Output() stateChanged = new EventEmitter<string>();
  @Output() openTaskDetailPopup = new EventEmitter<Task>();
  @Output() openCreateTaskPopup = new EventEmitter<State>();

  stateTasks: { [key: number]: Task[] } = {};
  draggingTask: Task | null = null;

  constructor(
    private taskService: TaskService
  ) { }

  ngOnChanges(): void {
    this.updateStates();
  }

  updateStates() {
    this.states.forEach((state) => {
      let tasks: Task[] = [];

      this.tasks.forEach((task) => {
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

  onDragEntered(task: Task) {
    this.draggingTask = task;
    this.draggedTask(this.draggingTask);
  }

  drop(event: CdkDragDrop<Task[]>, state_id: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    if (this.draggingTask) {
      this.draggingTask.state_id = state_id;
      this.editState(state_id.toString());
      this.draggingTask = null;
      this.draggedTask(null);
    }

    this.updateStateListOrdering(state_id);
  }

  private updateStateListOrdering(state_id: number) {
    this.stateTasks[state_id].forEach((value, index) => {
      index = this.stateTasks[state_id].length - index - 1;
      if (value.state_position !== index) {
        value.state_position = index;
        this.taskEdited.emit(value);
      }
    })
  }

  editTask(task: Task) {
    this.openTaskDetailPopup.emit(task);
  }

  createTask(state: State) {
    this.openCreateTaskPopup.emit(state);
  }

  draggedTask(task: Task | null) {
    this.taskDragged.emit(task);
  }

  editState(state_id: string) {
    this.stateChanged.emit(state_id);
  }
}
