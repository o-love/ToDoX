import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Query, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from 'src/app/models/form';
import { State } from 'src/app/models/state';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task-service/task-service.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, Form {

  form: FormGroup;

  @Input() boardId: string | null = null;
  @Input() taskListId: string | null = null;
  @Input() states: State[] | null = null;
  @Input() task: Task | null = null;
  
  selectedState: State | null = null;
  startDate: Date | null = null;
  dueDate: Date | null = null;

  @ViewChildren('input') inputs!: QueryList<ElementRef<any>>;

  disabled: boolean = true;
  statesPopup: boolean = false;

  @Output() close = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(200)]]
    })
  }
  
  ngOnInit(): void {
    if (!this.states || !this.task) return; 

    for (let state of this.states) {
      if (state.id == this.task.state_id) this.selectedState = state;
    }

    this.startDate = this.task.start_date;
    this.dueDate = this.task.due_date;

    this.form.setValue({
      name: this.task.name,
      description: this.task.description
    })
    this.form.controls['name'].disable();
    this.form.controls['description'].disable();
  }

  onClose() {
    if (!this.task) return; 

    // if (this.selectedState) this.task.state_id = this.selectedState.id; 

    // let dueDate = new Date();
    // let startDate = new Date();
    // if (this.dueDate) dueDate = new Date(this.dueDate);
    // if (this.startDate) startDate = new Date(this.startDate);

    // this.task.due_date = dueDate;
    // this.task.start_date = startDate;

    // this.editTask();
  }

  private editTask() {
    // if (!this.boardId || !this.taskListId || !this.task) return;

    // this.taskService.editTask(this.boardId, this.taskListId, this.task.id.toString(), this.task.name, this.task.description, this.task.state_id.toString(),
    // [], this.task.start_date, this.task.due_date).subscribe({
    //   next: (task: Task) => {
    //     this.close.emit(task);
    //     console.log(task);
    //   },
    //   error: (error) => console.log(error)
    // });
  }

  onDelete() {
    if (!this.boardId || !this.taskListId || !this.task) return;
    this.deleteTask.emit(this.task.id);
  }

  openStates() {
    this.statesPopup = true;
  }

  closeStates() {
    this.statesPopup = false;
  }

  changeState(state: State) {
    this.selectedState = state;
  }

  checkErrors(): boolean {
    let errors: boolean = false;

    this.inputs.forEach((label, index) => {
      const control = this.form.controls[Object.keys(this.form.controls)[index]];

      if (control.errors) {
        this.onError(label);
        errors = true;
      }
    });

    return errors;
  }

  resetErrors(): void {
    this.inputs.forEach((label) => {
			label.nativeElement.style.boxShadow = 'none';
		});
  }

  onError(label: ElementRef<any>): void {
    label.nativeElement.style.boxShadow = '0px 0px 7px rgb(255, 113, 113)';
  } 

  toggleDisable() {
    this.disabled = !this.disabled;
    if (this.disabled) {
      this.form.controls['name'].disable();
      this.form.controls['description'].disable();
    } else {
      this.form.controls['name'].enable();
      this.form.controls['description'].enable();
    }
  }

  save() {
    this.resetErrors();
    if (this.checkErrors() || !this.task) return;

    this.task.name = this.form.get('name')?.value;
    this.task.description = this.form.get('description')?.value;
    this.toggleDisable();
  }

  // Función para editar, para probar la conexión con la api, si da error 500 avísame
  // Cuando cargas una tarea, no estás llamando a la función getTaskById del task service, verdad?
  // Porque acabo de arreglar la ruta, por eso...
  onSaveEdit() { // Debería funcionar pero no le puedo dar click xD
    if (!this.boardId || !this.taskListId || !this.task) return;
    console.log("Editando");
    this.taskService.editTask(this.boardId, this.taskListId, this.task.id.toString(), this.task.name, this.task.description, this.task.state_id.toString(),
    [], this.task.start_date, this.task.due_date).subscribe({
      next: (task: Task) => {
        this.close.emit(task);
        console.log(task);
      },
      error: (error) => console.log(error)
    });
    console.log("Terminada la edición");
  }
}