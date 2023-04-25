import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Label } from 'src/app/models/label';
import { State } from 'src/app/models/state';
import { Task } from 'src/app/models/task';
import { TaskList } from 'src/app/models/taskList';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';
import { StateService } from 'src/app/services/state-service/state-service.service';
import { TaskService } from 'src/app/services/task-service/task-service.service';

@Component({
  selector: 'app-list-detail-kanban',
  templateUrl: './list-detail-kanban.component.html',
  styleUrls: ['./list-detail-kanban.component.scss']
})
export class ListDetailKanbanComponent {
  
  @Input() selectedList!: TaskList;
  @Input() tasks!: Task[];
  @Input() states!: State[];
  @Input() labels!: Label[];

  showPopup: boolean = false; 

  getTasksByStateId(state_id: number): Task[] {   
    let stateTasks: Task[] = [];

    this.tasks.forEach((task) => {
      if (task.state_id == state_id) stateTasks.push(task);
    });

    return stateTasks;
  }

  /*
  selectedList: TaskList = {
    id: 4,
    name: 'Sprint 1',
    description: 'A list for my first Sprint',
    board_id: 5,
    isEditing: false
  }

  tasks: Task[] = [];
  states: State[] = [];
  showPopup: boolean = false;

  boardId!: string;
  taskListId!: string;

  constructor(private taskService: TaskService, private boardService: BoardService, private route: ActivatedRoute) {
    this.boardId = this.selectedList.board_id.toString();
    this.taskListId = this.selectedList.id.toString(); 
  }

  ngOnInit() {
    console.log('Initialized');

    this.getTasks();
    this.getStates();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Changes had been done');

    this.getTasks();
    this.getStates();
  } 

  getTasks() {
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

  getStates() {
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

  getTasksByStateId(state_id: number): Task[] {
    let state_tasks: Task[] = [];

    this.states.forEach((state) => {
      if (state.id == state_id) {
        this.tasks.forEach((task) => {
          if (task.state_id == state_id) state_tasks.push(task);
        });
      }
    });

    return state_tasks;
  }*/
}