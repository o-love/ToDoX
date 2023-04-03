import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { State } from '../../models/state';

@Component({
  selector: 'app-create-state',
  templateUrl: './create-state.component.html',
  styleUrls: ['./create-state.component.scss']
})
export class CreateStateComponent { // implements OnInit
  stateForm!: FormGroup;
  // states: State[] = [];
  // displayedColumns: string[] = ['id', 'name', 'actions'];
  // editingState: State | null = null;

  // constructor(private fb: FormBuilder) { }

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