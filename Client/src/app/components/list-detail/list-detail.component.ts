import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskList } from 'src/app/models/taskList';
import { Task } from 'src/app/models/task';
import { State } from 'src/app/models/state';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';
import { TaskService } from 'src/app/services/task-service/task-service.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailComponent {
  @Input() selectedList: TaskList | undefined;
  taskList: TaskList | undefined;
  tasks: Task[] = [];

  boardId: string = '';
  taskListId: string = '';
  stateNames: {[key: string]: string} = {};

  showPopup: boolean = false;
  
  // selectedState: string = '';
  // stateId: string = '';
  states: State[] = [];

  constructor(private taskService: TaskService, private boardService: BoardService, private route: ActivatedRoute) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedList'] && changes['selectedList'].currentValue) {
      const selectedList = changes['selectedList'].currentValue;
      this.boardId = selectedList.board_id.toString();
      this.taskListId = selectedList.id.toString();
      this.getList();
      this.getTasks();
    }
  }

  getTasks(): void {
    this.taskService.getTasksByTaskListId(this.boardId, this.taskListId).subscribe(
      (tasks: Task[]) => {
        console.log('Tasks retrieved:', tasks);
        this.tasks = tasks;
        this.getStateNames();
      },
      (error: any) => {
        console.error('Error retrieving tasks:', error);
      }
    );
  }

  getList() {
    this.boardService.getList(this.boardId, this.taskListId).subscribe(
      (taskList: TaskList) => {
        console.log('TaskList retrieved:', taskList);
        this.taskList = taskList;
      }, 
      (error: any) => {
        console.error('Error retrieving taskList:', error);
      }
    );
  }

  addTask(newTask: Task): void {
    this.tasks.push(newTask);
    this.showPopup = false;
    this.getTasks();
  }

  getStateNames(): void {
    const stateIds = new Set(this.tasks.map(task => task.state_id));
    const observables: Observable<State>[] = Array.from(stateIds).map(stateId => this.taskService.getStateName(stateId.toString()));
    forkJoin(observables).subscribe(
      (states: State[]) => {
        states.forEach((state: State) => {
          this.stateNames[state.id] = state.name;
        });
      },
      (error: any) => {
        console.error('Error retrieving state names:', error);
      }
    );
  }

  getStateName(stateId: string) {
    return this.stateNames[stateId];
  }

  deleteTask(id: number): void {
    console.log("Delete task", id);
    if (this.boardId) {
      this.taskService.deleteTask(this.boardId, this.taskListId, id.toString()).subscribe(() => {
        this.getTasks();
      });
      console.log("Deleted task", id);
    }
  }

  editTask(id: number): void {
    console.log("Task id edit", id);
    this.tasks[id].isEditing = true;
  }

  saveTaskEdit(index: number): void {
    const task = this.tasks[index];
    if (this.boardId){
      this.taskService.editTask(this.boardId, this.taskListId, task.id.toString(), task.name, task.description,
      task.state_id.toString(), [], task.due_date, task.start_date).subscribe(
        (response) => {
          console.log("Task updated:", response);
          task.isEditing = false;
          this.getTasks();
        },
        (error) => {
          console.error("Error updating task:", error);
        }
      );
    }
  }
  
  cancelTaskEdit(index: number): void {
    this.tasks[index].isEditing = false;
  }
}
