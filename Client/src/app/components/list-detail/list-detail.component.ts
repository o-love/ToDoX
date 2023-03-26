import { Component, Input } from '@angular/core';
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

  boardId: string = '';
  taskListId: string = '';

  tasks: Task[] = [];

  constructor(private taskService: TaskService, private boardService: BoardService) { }

  ngOnInit(): void {
    if (this.selectedList) {
      console.log(this.selectedList);
      this.boardId = this.selectedList.board_id.toString();
      this.taskListId = this.selectedList.id.toString()
      console.log("board ", this.boardId, " task ", this.taskListId);
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
}
