import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TaskList } from 'src/app/models/taskList';
import { Task } from 'src/app/models/task';
import { State } from 'src/app/models/state';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';
import { TaskService } from 'src/app/services/task-service/task-service.service';
import { Label } from 'src/app/models/label';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailComponent implements OnChanges {
  @Input() selectedList: TaskList | null = null;
  @Input() usersId: {[key: number]: User} = {}
  @Input() user: User | null = null;
  @Output() taskListEdited = new EventEmitter<TaskList>();
  @Output() taskListDeleted = new EventEmitter<number>();

  tasks: Task[] = [];
  states: State[] = [];
  labels: Label[] = [];

  boardId: string = '';
  taskListId: string = '';

  selectedTask: Task | null = null;
  selectedState: State | null = null;

  showCreateTaskPopup: boolean = false;
  showTaskDetailPopup: boolean = false;
  showSettingsPopup: boolean = false;

  @ViewChild('title') selectTitle!: ElementRef<any>;
  @ViewChild('icon') dropdownIcon!: ElementRef<any>;
  @ViewChild('select') select!: ElementRef<any>;

  @ViewChildren('option') options!: QueryList<ElementRef<any>>;
  @ViewChild('table') tableOption!: ElementRef<any>;
  @ViewChild('kanban') kanbanOption!: ElementRef<any>;

  layouts: Map<string, boolean> = new Map();
  timeout: boolean = false;

  constructor(private taskService: TaskService) {
    this.layouts.set('TABLE LAYOUT', false);
    this.layouts.set('KANBAN LAYOUT', true);
  }

  ngOnChanges() {
    if (!this.selectedList) return;

    this.states = [];
    this.labels = [];
    this.tasks = [];

    this.boardId = this.selectedList.board_id.toString();
    this.taskListId = this.selectedList.id.toString();
    this.reload();
    this.getLabels();
  }

  reload() {
    this.getTasks();
    this.getStates();
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

  editTaskList(taskList: TaskList) {
    if (!this.selectedList) return;
    this.selectedList.name = taskList.name;
    this.selectedList.description = taskList.description;
    this.taskListEdited.emit(taskList);
  }

  deleteTaskList() {
    if (!this.selectedList) return;
    this.taskListDeleted.emit(this.selectedList.id);
    let $this = this;
    setTimeout(function() { $this.closePopup() }, 1000);
  }

  changeTaksState(state_id: string, reload: boolean): void {
    if (!this.selectedTask) return;

    this.taskService.changeTaskState(this.boardId, this.taskListId, this.selectedTask.id.toString(), state_id).subscribe(
      (task: Task) => {
        console.log('saved task:', task);
        if (reload) this.reload();
      },
      (error: any) => {
        console.log('Se produjo un error:', error);
    });
  }

  editTask(task: Task): void {
    if (!this.selectedTask) return;
    this.unrestrictedEditTask(task);
  }

  unrestrictedEditTask(task: Task): void {
    console.log('task id:', task.id);
    this.taskService.editTask(this.boardId, this.taskListId, task.id.toString(), task.name,
      task.description, task.state_id.toString(), [], task.start_date, task.due_date, task.state_position).subscribe({
      next: (task: Task) => {
        console.log('saved task:', task);
      },
      error: (error) => console.log(error)
    });
  }

  deleteTask(task_id: number): void {
    if (!this.selectedList || !this.selectedList.board_id) return;

    this.taskService.deleteTask(this.boardId, this.taskListId, task_id.toString()).subscribe(
      () => {
        this.reload();
        this.closePopup();
      },
      (error: any) => {
        console.error('Error deleting task:', error);
      }
    );
  }

  selectLayout(selected_option: ElementRef<any>) {
    this.options.forEach((option) => {
      if (option.nativeElement.classList.contains('checked')) {
        option.nativeElement.classList.toggle('checked');
        this.layouts.set(option.nativeElement.innerText.toString(), false);
      }
    });

    this.selectTitle.nativeElement.innerText = selected_option.nativeElement.innerText;

    this.options.forEach((option) => {
      if (option.nativeElement.innerText == selected_option.nativeElement.innerText) {
        option.nativeElement.classList.toggle('checked');
        this.layouts.set(option.nativeElement.innerText.toString(), true);
      }
    });

    this.selectActive();
  }

  selectActive() {
    this.dropdownIcon.nativeElement.classList.toggle('icon-arrow-down');
    this.dropdownIcon.nativeElement.classList.toggle('icon-arrow-up');
    this.select.nativeElement.classList.toggle('closed');
  }

  closePopup() {
    if (this.showCreateTaskPopup) this.showCreateTaskPopup = false;
    if (this.showTaskDetailPopup) this.showTaskDetailPopup = false;
    if (this.showSettingsPopup) this.showSettingsPopup = false;
    this.selectedTask = null;
  }

  openSettingsPopup() {
    this.showSettingsPopup = true;
  }

  openCreateTaskPopup(state: State | null) {
    this.selectState(state);
    this.showCreateTaskPopup = true;
  }

  openTaskDetailPopup(task: Task) {
    this.selectTask(task);
    this.showTaskDetailPopup = true;
  }

  selectState(state: State | null) {
    this.selectedState = state;
  }

  selectTask(task: Task | null) {
    this.selectedTask = task;
  }
}
