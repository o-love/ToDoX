import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TaskList } from 'src/app/models/taskList';
import { Task } from 'src/app/models/task';
import { State } from 'src/app/models/state';
import { TaskService } from 'src/app/services/task/task.service';
import { Label } from 'src/app/models/label';
import { User } from 'src/app/models/user';
import { TaskListService } from 'src/app/services/task-list/task-list.service';
import { ActivatedRoute, Params } from '@angular/router';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailComponent implements OnChanges {
  taskList: TaskList | null = null;

  // expected to change / delete after refactoring user service
  @Input() usersId: { [key: number]: User } = {};
  @Input() user: User | null = null;
  @Input() taskListId: string | null = null;

  @Output() edited: EventEmitter<void> = new EventEmitter();
  @Output() deleted: EventEmitter<string> = new EventEmitter();

  boardId = this.route.snapshot.paramMap.get('boardId');

  tasks: Task[] | undefined;
  states: State[] | undefined;
  labels: Label[] | undefined;

  selectedTask: number | null = null;
  selectedState: number | null = null;

  loading: boolean = false;

  showSettings: boolean = false;
  showCreateTask: boolean = false;
  showTaskDetail: boolean = false;
  showCreateState: boolean = false;
  showCreateLabel: boolean = false;

  layouts: { [key: number]: boolean } = { 0: false, 1: true };

  constructor(private route: ActivatedRoute, private taskListService: TaskListService, private stateService: StateService, private taskService: TaskService) { }

  // ng -----------------------------------------------------------------------------

  ngOnChanges(): void {
    this.getTaskList();
    this.reload();
  }

  // update -------------------------------------------------------------------------

  // when labels are added a get labels method must be created and added here
  reload() {
    this.getStates();
    this.getTasks();
  }

  // getters ------------------------------------------------------------------------

  private getTaskList() {
    if (!this.boardId || !this.taskListId) return;
    console.log('loading tasklist %d...', this.taskListId);
    this.taskListService.getListById(this.boardId, this.taskListId).then((taskList: TaskList) => this.taskList = taskList);
  }

  private getStates() {
    if (!this.boardId || !this.taskListId) return;
    console.log('loading tasklist %d states...', this.taskListId);
    const tasklist_id: string | null = this.taskListId;
    this.states = undefined;
    this.stateService.getStatesByTaskListId(this.boardId, this.taskListId).then(
      (states: State[]) => {
        if (tasklist_id == this.taskListId) this.states = states;
      }
    );
  }

  private getTasks() {
    if (!this.boardId || !this.taskListId) return;
    console.log('loading tasklist %d tasks...', this.taskListId);
    const tasklist_id: string | null = this.taskListId;
    this.tasks = undefined;
    this.taskService.getTasksByTaskListId(this.boardId, this.taskListId).then(
      (tasks: Task[]) => {
        if (tasklist_id == this.taskListId) this.tasks = tasks;
      }
    );
  }

  // get labels method must be included here when CRUD for labels is done

  // lists --------------------------------------------------------------------------

  editTaskList(taskList: TaskList) {
    if (!this.boardId || !this.taskListId || !this.taskList) return;

    this.taskListService.editTasklist(this.boardId, this.taskListId, taskList.name, taskList.description).then(
      (taskList: TaskList) => {
        this.getTaskList();
        this.edited.emit();
      }
    )
  }

  deleteTaskList() {
    if (!this.boardId || !this.taskListId) return;
    let $this = this;
    setTimeout(function () { $this.deleted.emit($this.taskListId?.toString()) }, 1000);
  }

  // states--------------------------------------------------------------------------

  editState(state: State): void {
    if (!this.boardId || !this.taskListId) return;
    console.log('editing state %d...', state.id);
    this.stateService.editState(this.taskListId, state.id, state.name).then(
      (state: State) => {
        this.getStates();
      }
    )
  }

  // tasks --------------------------------------------------------------------------

  editTask(task: Task): void {
    if (!this.boardId || !this.taskListId || !this.selectedTask) return;
    console.log('editing task %d...', this.selectedTask);
    this.taskService.editTask(this.boardId, this.taskListId, this.selectedTask.toString(), task.name, task.description, task.state_id.toString(), [], task.start_date, task.due_date, task.recurring_period).then(
      (task: Task) => this.reload()
    );
  }

  deleteTask(taskId: number): void {
    if (!this.boardId || !this.taskListId) return;

    this.taskService.deleteTask(this.boardId, this.taskListId, taskId).then(
      () => {
        this.reload();
        this.hideModals();
      }
    )
  }

  // selectors ----------------------------------------------------------------------

  selectTask(taskId: number | null) {
    this.selectedTask = taskId;
  }

  selectState(stateId: number | null) {
    this.selectedState = stateId;
  }

  selectLayout(index: number) {
    this.layouts[index] = !this.layouts[index];
  }

  // modals -------------------------------------------------------------------------

  show(): boolean {
    return this.showCreateTask || this.showSettings || this.showTaskDetail || this.showCreateState || this.showCreateLabel;
  }

  hideModals() {
    if (this.showCreateTask) this.showCreateTask = false;
    if (this.showTaskDetail) this.showTaskDetail = false;
    if (this.showSettings) this.showSettings = false;
    if (this.showCreateState) this.showCreateState = false;
    if (this.showCreateLabel) this.showCreateLabel = false;
    this.selectTask(null);
  }

  openSettings() {
    this.showSettings = true;
  }

  openCreateTask(stateId: number | null) {
    this.selectState(stateId);
    this.showCreateTask = true;
  }

  openCreateState() {
    this.showCreateState = true;
  }

  openCreateLabel() {
    this.showCreateLabel = true;
  }

  openTaskDetail(taskId: number) {
    this.selectTask(taskId);
    this.showTaskDetail = true;
  }
}
