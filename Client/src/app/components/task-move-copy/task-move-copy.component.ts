import {Component, Input} from '@angular/core';
import {Board} from "../../models/board";
import {TaskList} from "../../models/taskList";
import {BoardService} from "../../services/board-taskList-service/board-taskList-service.service";
import {TaskService} from "../../services/task-service/task-service.service";
import {TaskListService} from "../../services/taskList-service/task-list-service.service";
import {Task} from "../../models/task";
import {State} from "../../models/state";
import {StateService} from "../../services/state-service/state-service.service";

@Component({
  selector: 'app-task-move-copy',
  templateUrl: './task-move-copy.component.html',
  styleUrls: ['./task-move-copy.component.scss']
})
export class TaskMoveCopyComponent {

  @Input() boardId: string | undefined;
  @Input() taskListId: string | undefined;
  @Input() task: Task | undefined;

  isCopy: boolean = true;

  boards: Board[] = [];
  taskLists: TaskList[] = [];
  states: State[] = [];

  selectedBoard: Board | undefined;
  selectedTaskList: TaskList | undefined;
  selectedState: State | undefined;
  positionNumber: number | undefined;


  constructor(private boardService: BoardService, private taskListService: TaskListService, private taskService: TaskService, private stateService: StateService) {
    // TODO: Test values, remove on final version before merging to develop
    this.boardId = '2';
    this.taskListId = '2';
    this.taskService.getTask(this.boardId, this.taskListId, '1').subscribe((task) => {
      this.task = task;
      this.positionNumber = task.state_position;
    });
  }

  ngOnInit() {
    if(this.boardId && this.taskListId) {
      this.boardService.getBoards().subscribe((boards) => {
        this.boards = boards;
        this.selectedBoard = this.boards.find((board: Board) => board.id.toString() === this.boardId);
      });

      this.boardService.getTaskListsByBoardId(this.boardId).subscribe((taskLists) => {
        this.taskLists = taskLists;
        this.selectedTaskList = this.taskLists.find((taskList) => taskList.id.toString() === this.taskListId);
        this.updateStates();
      })
    }
  }

  updateTaskLists() {
    if (this.selectedBoard) {
      console.log(this.selectedBoard)
      this.boardService.getTaskListsByBoardId(this.selectedBoard.id.toString()).subscribe((taskLists) => {
        this.taskLists = taskLists;
        this.selectedTaskList = taskLists[0];
      })
    }
  }

  updateStates() {
    if (this.selectedTaskList && this.selectedBoard) {
      this.stateService.getStatesByTaskListId(this.selectedBoard.id.toString(), this.selectedTaskList.id.toString()).subscribe((states) => {
        this.states = states;
        this.selectedState = states[0];
      });
    }
  }

  submit() {
    if (this.task === undefined || this.positionNumber === undefined || this.taskListId === undefined || this.boardId === undefined || this.selectedBoard === undefined) return;

    if (this.isCopy) {
      // TODO: Look into labels, how it work and copy it. Need to wait for Alberto to implement label services.
      this.taskService.createTask(this.boardId, this.taskListId, this.task?.name, this.task?.description, this.task?.state_id.toString(), [], this.task?.start_date, this.task?.due_date, this.positionNumber);
    }
  }

}
