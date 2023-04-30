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

  @Input() selectedList!: TaskList;
  @Input() tasks!: Task[];
  @Input() states!: State[];
  @Input() labels!: Label[];

  @Output() taskEdited = new EventEmitter<Task>();
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
  }

  onDragEntered(task: Task) {
    this.draggingTask = task;
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
      this.taskEdited.emit(this.draggingTask);
      this.changeTaksState(this.selectedList.id.toString(), state_id.toString(), this.draggingTask.id.toString(), state_id.toString());
      this.draggingTask = null;
    }
  }

  editTask(task: Task) {
    this.openTaskDetailPopup.emit(task);
  }

  createTask(state: State) {
    this.openCreateTaskPopup.emit(state);
  }

  changeTaksState(boardId: string, listId: string, taskId: string, stateId: string): void {
    this.taskService.changeTaskState(boardId, listId, taskId, stateId)
      .subscribe(task => {
      },
      error => {
        console.log('Se produjo un error:', error);
      });
  }
}
