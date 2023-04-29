import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Label } from 'src/app/models/label';
import { State } from 'src/app/models/state';
import { Task } from 'src/app/models/task';
import { TaskList } from 'src/app/models/taskList';

@Component({
  selector: 'app-list-detail-kanban',
  templateUrl: './list-detail-kanban.component.html',
  styleUrls: ['./list-detail-kanban.component.scss']
})
export class ListDetailKanbanComponent {
  
  @Input() selectedList!: TaskList;
  @Input() tasks!: Task[];
  @Input() states!: State[];
  @Input() labels!: Label[];

  @Output() openTaskDetailPopup = new EventEmitter<Task>();
  @Output() openCreateTaskPopup = new EventEmitter<State>();

  getTasksByStateId(state_id: number): Task[] {   
    let stateTasks: Task[] = [];

    this.tasks.forEach((task) => {
      if (task.state_id == state_id) stateTasks.push(task);
    });

    return stateTasks;
  }

  editTask(task: Task) {
    this.openTaskDetailPopup.emit(task);
  }

  createTask(state: State) {
    this.openCreateTaskPopup.emit(state);
  }
}