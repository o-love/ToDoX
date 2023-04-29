import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
export class ListDetailComponent implements OnChanges {
  @Input() selectedList!: TaskList;
  tasks: Task[] = [];
  states: State[] = [];
  labels: Label[] = [];

  boardId: string = '';
  taskListId: string = '';

  selectedTask: Task | null = null;
  selectedState: State | null = null;

  showCreateTaskPopup: boolean = false;
  showTaskDetailPopup: boolean = false;

  @ViewChild('title') selectTitle!: ElementRef<any>;
  @ViewChild('icon') dropdownIcon!: ElementRef<any>;
  @ViewChild('select') select!: ElementRef<any>;

  @ViewChildren('option') options!: QueryList<ElementRef<any>>;
  @ViewChild('table') tableOption!: ElementRef<any>;
  @ViewChild('kanban') kanbanOption!: ElementRef<any>;

  layouts: Map<string, boolean> = new Map();

  constructor(private taskService: TaskService) {
    this.layouts.set('TABLE LAYOUT', false);
    this.layouts.set('KANBAN LAYOUT', true);
  }

  ngOnChanges() {
    this.states = [];
    this.labels = [];
    this.tasks = [];
    
    this.boardId = this.selectedList.board_id.toString();
    this.taskListId = this.selectedList.id.toString();

    console.log(this.taskListId);

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
    this.closePopup();
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
        this.closePopup();
      }, 
      (error: any) => {
        console.error('Error deleting task:', error);
      }
    );
  }

  saveTaskEdit(task: Task) {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id == task.id) this.tasks[i] = task;
    }
  }

  // editTask(task_id: number): void {
  //   console.log('Task id edit:', task_id);

  //   this.tasks.forEach((task, index) => {
  //     if (task.id == task_id) this.tasks[index].isEditing = true;
  //   });
  // }

  // /* NEEDS CHANGE */
  // saveTaskEdit(index: number, labels: Label[]): void {
  //   if (!this.selectedList.board_id) return;

  //   const task = this.tasks[index];
  //   this.taskService.editTask(this.boardId, this.taskListId, task.id.toString(), task.name, task.description,
  //   task.state_id.toString(), labels, task.due_date, task.start_date).subscribe(
  //     (response) => {
  //       console.log('Task updated: ', response);
  //       task.isEditing = false;
  //     },
  //     (error: any) => {
  //       console.error('Error updating task:', error);
  //     }
  //   ) 
  // }
  
  // /* NEEDS CHANGE */
  // cancelTaskEdit(index: number): void {
  //   this.tasks[index].isEditing = false;
  // }


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
  }

  openCreateTaskPopup(state: State | null) {
    this.selectedState = state;
    this.showCreateTaskPopup = true;
  }

  openTaskDetailPopup(task: Task) {
    this.selectedTask = task;
    this.showTaskDetailPopup = true;
  }
}