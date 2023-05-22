import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Board} from "../../models/board";
import {TaskList} from "../../models/taskList";
import {Task} from "../../models/task";
import {State} from "../../models/state";
import { BoardService } from 'src/app/services/board/board.service';
import { TaskListService } from 'src/app/services/task-list/task-list.service';
import { TaskService } from 'src/app/services/task/task.service';
import { StateService } from 'src/app/services/state/state.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-move-copy',
  templateUrl: './task-move-copy.component.html',
  styleUrls: ['./task-move-copy.component.scss']
})
export class TaskMoveCopyComponent {

  boardId: string | null = this.route.snapshot.paramMap.get('boardId');
  taskListId: string | null = this.route.snapshot.paramMap.get('listId');

  @Input() task: Task | null = null;
  @Output() close: EventEmitter<void> = new EventEmitter();

  @ViewChild('btn', { read: ElementRef }) btn!: ElementRef;
 
  isCopy: boolean = true;

  boards: Board[] = [];
  taskLists: TaskList[] = [];
  states: State[] = [];

  selectedTaskList: TaskList | undefined;
  selectedState: State | null = null;
  positionNumber: number = 0;

  loading: boolean = false;

  constructor(private route: ActivatedRoute, private boardService: BoardService, private taskListService: TaskListService, private taskService: TaskService, private stateService: StateService) {}

  // ng -----------------------------------------------------------------------------

  ngOnInit() {
    this.getBoards();
    this.getTaskLists();
  }

  // getters ------------------------------------------------------------------------

  private getBoards() {
    if(!this.boardId || !this.taskListId) return;

    this.boardService.getBoards().then(
      (boards: Board[]) => this.boards = boards
    );
  }

  private getTaskLists() {
    if(!this.boardId || !this.taskListId) return;

    this.taskListService.getTaskListsByBoardId(this.boardId).then(
      (taskLists: TaskList[]) => {
        this.taskLists = taskLists;
        this.selectedTaskList = this.taskLists.find((taskList: TaskList) => taskList.id == this.taskListId);
        console.log(this.selectedTaskList);
        this.updateStates();
      }
    );
  }

  // update -------------------------------------------------------------------------

  // updateTaskLists() {
  //   if (!this.selectedBoard) return;
  //   console.log(this.selectedBoard)
  //   this.taskListService.getTaskListsByBoardId(this.selectedBoard.id).then(
  //     (taskLists: TaskList[]) => {
  //       this.taskLists = taskLists;
  //       this.selectedTaskList = taskLists[0];
  //     }
  //   );
  // }

  updateStates() {
    if (!this.selectedTaskList || !this.boardId) return;

    this.stateService.getStatesByTaskListId(this.boardId, this.selectedTaskList.id).then(
      (states: State[]) => {
        this.states = states;
        this.selectedState = states[0];

      }
    );
  }

  updatePosition() {
    if (!this.selectedState) return;
    if (!this.selectedState.tasks) this.positionNumber = 0;
    else this.positionNumber = this.selectedState.tasks.length;
  }

  // submit -------------------------------------------------------------------------

  setIsCopy(value: boolean) {
    this.isCopy = value;
  }

  submit() {
    if (!this.task || !this.taskListId || !this.selectedTaskList || !this.boardId || !this.selectedState) return;

    this.btn.nativeElement.style.backgroundColor = '#202130';
    this.btn.nativeElement.style.color = 'white';

    this.loading = true;

    let labels: number[] = [];
      if (this.selectedTaskList.id == this.task.tasklist_id.toString()) labels = this.task.selectedLabels;

    if (this.isCopy) { 
      this.taskService.copyTask(this.boardId, this.task, labels, this.selectedTaskList.id, this.selectedState.id.toString()).then(
        (task: Task) => {
          console.log('task copied:', task);
          this.close.emit();
        }
      )
    } else {
      // comprobación para que no me mueva la misma tarea al mismo sitio
      if (this.taskListId == this.selectedTaskList.id && this.task.state_id == this.selectedState.id) {
        this.loading = false;
        return;
      }

      this.taskService.moveTask(this.boardId, this.selectedTaskList.id, this.task.id, labels, this.selectedTaskList.id, this.selectedState.id.toString()).then(
        (task: Task) => {
          console.log('task moved:', task);
          this.close.emit();
        }
      )
    }
  }

  // convertPositionNumber(): number {
  //   if (!(this.positionNumber && this.selectedState)) {
  //     return 0;
  //   }

  //   return Math.abs(this.selectedState.tasks.length - this.positionNumber);
  // }
}