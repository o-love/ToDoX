import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskList } from 'src/app/models/taskList';
import { Task } from 'src/app/models/task';
import { State } from 'src/app/models/state';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';
import { TaskService } from 'src/app/services/task-service/task-service.service';
import { Label } from 'src/app/models/label';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailComponent implements OnInit {
  @Input() selectedList!: TaskList;
  tasks: Task[] = [];
  states: State[] = [];
  labels: Label[] = [];

  boardId: string = '';
  taskListId: string = '';

  showPopup: boolean = false;

  constructor(private taskService: TaskService, private boardService: BoardService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.boardId = this.selectedList.board_id.toString();
    this.taskListId = this.selectedList.id.toString();

    this.getTasks();
    this.getStates();
    this.getLabels();
  }

  private getTasks(): void {
    this.taskService.getTasksByTaskListId(this.boardId, this.taskListId).subscribe(
      (tasks: Task[]) => {
        console.log('Tasks retrieved:', tasks);
        this.tasks = tasks;
      },
      (error: any) => {
        console.error('Error retieving tasks:', error);
      }
    )
  }

  private getStates() {
    this.taskService.getStatesByTaskListId(this.boardId, this.taskListId).subscribe(
      (states: State[]) => {
        console.log('States retrieved:', states);
        this.states = states;
      },
      (error: any) => {
        console.error('Error retrieving states:', error);
      }
    );
  }

  private getLabels() {
    this.taskService.getLabels().subscribe(
      (labels: Label[]) => {
        console.log('Labels retrieved:', labels);
        this.labels = labels;
      }, 
      (error: any) => {
        console.error('Error retrieving labels:', error);
      }
    )
  }

  addTask(newTask: Task): void {
    this.tasks.push(newTask);
    this.showPopup = false;
  }

  deleteTask(task_id: number): void {
    if (!this.selectedList.board_id) return;

    this.taskService.deleteTask(this.boardId, this.taskListId, task_id.toString()).subscribe(
      () => {
        for (let index = 0; index < this.tasks.length; index++) {
          if (this.tasks[index].id == task_id) {
            this.tasks.splice(index, 1);
            console.log('Deleted task:', task_id);
            break;
          }
        }
      }, 
      (error: any) => {
        console.error('Error deleting task:', error);
      }
    );
  }

  editTask(task_id: number): void {
    console.log('Task id edit:', task_id);

    this.tasks.forEach((task, index) => {
      if (task.id == task_id) this.tasks[index].isEditing = true;
    });
  }

  /* NEEDS CHANGE */
  saveTaskEdit(index: number, labels: Label[]): void {
    if (!this.selectedList.board_id) return;

    const task = this.tasks[index];
    this.taskService.editTask(this.boardId, this.taskListId, task.id.toString(), task.name, task.description,
    task.state_id.toString(), labels, task.due_date, task.start_date).subscribe(
      (response) => {
        console.log('Task updated: ', response);
        task.isEditing = false;
      },
      (error: any) => {
        console.error('Error updating task:', error);
      }
    ) 
  }
  
  /* NEEDS CHANGE */
  cancelTaskEdit(index: number): void {
    this.tasks[index].isEditing = false;
  }
}