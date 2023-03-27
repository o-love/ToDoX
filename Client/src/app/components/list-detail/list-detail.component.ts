import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskList } from 'src/app/models/taskList';
import { Task } from 'src/app/models/task';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';
import { TaskService } from 'src/app/services/task-service/task-service.service';

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
  taskName: string = '';
  taskDescription: string = '';

  showPopup: boolean = false;

  constructor(private taskService: TaskService, private boardService: BoardService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.selectedList) {
      this.boardId = this.selectedList.board_id.toString();
      this.taskListId = this.selectedList.id.toString();
      this.getList();
      this.getTasks();
    }
  }

  getTasks(): void {
    this.taskService.getTasksByTaskListId(this.boardId, this.taskListId).subscribe(
      (tasks: Task[]) => {
        console.log('Tasks retrieved:', tasks);
        this.tasks = tasks;
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
}
