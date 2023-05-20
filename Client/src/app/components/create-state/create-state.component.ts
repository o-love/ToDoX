import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { State } from '../../models/state';
import { Form } from 'src/app/models/form';
import { StateService } from 'src/app/services/state/state.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-state',
  templateUrl: './create-state.component.html',
  styleUrls: ['./create-state.component.scss']
})
export class CreateStateComponent implements Form { // implements OnInit
  stateForm!: FormGroup;
  loading: boolean = false;

  boardId: string | null = this.route.snapshot.paramMap.get('boardId');
  listId: string | null = this.route.snapshot.paramMap.get('listId');

  @ViewChild('input') input!: ElementRef<any>;
  @Output() newState = new EventEmitter<State>();
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private stateService: StateService) { 
    this.stateForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]]
    });
  }

  onClose() {
    this.close.emit();
  }

  checkErrors(): boolean {
    let errors: boolean = false;

    const control = this.stateForm.controls['name'];

    if (control.errors) {
      this.onError(this.input);
      errors = true;
    }

    return errors;
  }

  resetErrors(): void {
    this.input.nativeElement.style.boxShadow = 'none';
  }

  onError(label: ElementRef<any>): void {
    label.nativeElement.style.boxShadow = '0px 0px 7px rgb(255, 113, 113)';
  }

  onSubmit() {
    this.resetErrors();
    if (this.checkErrors()) return;

    let name: string = this.stateForm.value.name;
    this.createState(name);
  }

  private createState(name: string) {
    if (!this.boardId || !this.listId) return;
    this.loading = true;
    console.log('creating new state...');
    this.stateService.createState(this.boardId, this.listId, name).then(
      (state: State) => {
        this.loading = false;
        this.onClose();
        this.newState.emit();
      }
    )
  }
}