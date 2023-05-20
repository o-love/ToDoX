import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { TaskList } from 'src/app/models/taskList';
import { ActivatedRoute } from '@angular/router';
import { Form } from 'src/app/models/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskListService } from 'src/app/services/task-list/task-list.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss']
})
export class CreateListComponent implements Form {
  form: FormGroup;

  boardId = this.route.snapshot.paramMap.get('boardId');

  @Output() listCreated = new EventEmitter<string>();
  @Output() closePopup = new EventEmitter<void>();

  @ViewChild('name') name!: ElementRef<any>;

  loading: boolean = false;

  constructor(private fb: FormBuilder, private taskListService: TaskListService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.maxLength(100)]]
    });
  }

  onClose(): void {
    this.closePopup.emit();
  }

  checkErrors(): boolean {
    if (this.form.controls['name'].errors) this.onError(this.name);
    return (this.form.controls['name'].errors != null);
  }

  resetErrors(): void {
    this.name.nativeElement.style.boxShadow = 'none';
  }
  
  onError(label: ElementRef) {
    label.nativeElement.style.boxShadow = '0px 0px 7px rgba(255, 113, 113, 0.7)';
  }

  onSubmit() {
    this.resetErrors();
    if (this.checkErrors()) return;
    
    let name: string = this.form.get('name')?.value;
    let description: string = this.form.get('description')?.value;

    this.loading = true;
    this.createList(name, description);
  }

  private createList(name: string, description: string) {
    if (!this.boardId) return;

    // change when labels are added
    this.taskListService.createList(this.boardId, name, description).then(
      (list: TaskList) => {
        this.loading = false;
        this.listCreated.emit(list.id);
      }
    );
  } 
}