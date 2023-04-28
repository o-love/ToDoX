import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { State } from '../../models/state';
import { Form } from 'src/app/models/form';

@Component({
  selector: 'app-create-state',
  templateUrl: './create-state.component.html',
  styleUrls: ['./create-state.component.scss']
})
export class CreateStateComponent implements Form { // implements OnInit
  stateForm!: FormGroup;
  // states: State[] = [];
  // displayedColumns: string[] = ['id', 'name', 'actions'];
  // editingState: State | null = null;

  constructor(private fb: FormBuilder) { 
    this.stateForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  checkErrors(): boolean {
    throw new Error('Method not implemented.');
  }

  resetErrors(): void {
    throw new Error('Method not implemented.');
  }

  onError(label: ElementRef<any>): void {
    throw new Error('Method not implemented.');
  }

  onFocus(event: any, label: any): void {
    throw new Error('Method not implemented.');
  }
  
  onBlur(event: any, label: any): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    
  }

  // ngOnInit(): void {
  //   this.stateForm = this.fb.group({
  //     name: ['', Validators.required]
  //   });
  // }

  // onSubmit() {
  //   const { value } = this.stateForm;
  //   if (this.editingState) {
  //     const index = this.states.findIndex(s => s.id === this.editingState!.id);
  //     this.states[index] = { ...this.editingState, name: value.name };
  //     this.editingState = null;
  //   } else {
  //     const newState: State = {
  //       id: 1,
  //       name: 'New State',
  //       tasks: []
  //     };
  //     this.states.push(newState);
  //   }
  //   this.stateForm.reset();
  // }

  // resetForm() {
  //   this.editingState = null;
  //   this.stateForm.reset();
  // }

  // editState(state: State) {
  //   this.editingState = state;
  //   this.stateForm.patchValue({ name: state.name });
  // }

  // deleteState(state: State) {
  //   const index = this.states.findIndex(s => s.id === state.id);
  //   this.states.splice(index, 1);
  // }
}