import { Component, EventEmitter, Input, Output } from '@angular/core';
import { State } from 'src/app/models/state';
import { ActivatedRoute, Router } from '@angular/router'
import { TaskService } from 'src/app/services/task-service/task-service.service';

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
      this.taskService.getStates(this.boardId, this.taskListId).subscribe({
        next: (states) => {
          this.states = states;
        },
        error: (error) => console.log(error)
      });
    }
  }

  onSubmit() {
    if (this.boardId && this.taskListId && this.taskName && this.selectedState) {
      // const state = this.states.find(state => state.id === parseInt(this.selectedState));
      // if (state) this.stateId = state.id.toString();
      // console.log("Task", this.taskName, " description ", this.taskDescription, " state ", this.stateId);
      this.taskService.createTask(this.boardId, this.taskListId, this.taskName, this.taskDescription, "1").subscribe({
        next: (task) => {
          this.taskCreated.emit(task);
          this.taskName = '';
          this.taskDescription = '';
          this.stateId = '';
        },
        error: (error) => console.log(error)
      });
    }
  }

  onClose() {
    this.closePopup.emit();
  }
}
