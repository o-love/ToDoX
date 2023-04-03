import { Component, EventEmitter, Input, Output } from '@angular/core';
import { State } from 'src/app/models/state';
import { ActivatedRoute, Router } from '@angular/router'
import { TaskService } from 'src/app/services/task-service/task-service.service';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent {
  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  taskName: string = '';
  taskDescription: string = '';

  selectedState: string = '';
  stateId: string = '';
  states: State[] = [];

  @Output() taskCreated = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<void>();

  @Input() boardId: string | undefined;
  @Input() taskListId: string | undefined;

  ngOnInit() {
    this.getStates();
  }

  getStates() {
    if (this.boardId && this.taskListId) {
      this.taskService.getStatesByTaskListId(this.boardId, this.taskListId).subscribe({
        next: (states) => {
          this.states = states;
        },
        error: (error) => console.log(error)
      });
    }
    console.log("states de board", this.boardId, "y list", this.taskListId, "states:", this.states);
  }

  onSubmit() {
    if (this.boardId && this.taskListId && this.taskName && this.selectedState) {
      const state = this.states.find(state => state.id === parseInt(this.selectedState));
      if (state) this.stateId = state.id.toString();
      if (state) {
        this.taskService.createTask(this.boardId, this.taskListId, this.taskName, this.taskDescription, this.stateId).subscribe({
          next: (task: Task) => {
            this.taskCreated.emit(task);
            this.taskName = '';
            this.taskDescription = '';
            this.stateId = '';
          },
          error: (error) => console.log(error)
        });
      }
    }
  }

  onClose() {
    this.closePopup.emit();
  }
}