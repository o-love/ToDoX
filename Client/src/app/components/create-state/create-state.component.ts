import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { State } from '../../models/state';
import { Form } from 'src/app/models/form';
import { StateService } from 'src/app/services/state-service/state-service.service';

@Component({
  selector: 'app-create-state',
  templateUrl: './create-state.component.html',
  styleUrls: ['./create-state.component.scss']
})
export class CreateStateComponent implements Form { // implements OnInit
  stateForm!: FormGroup;
  
  @ViewChild('input') input!: ElementRef<any>;
  @Output() newState = new EventEmitter<State>();

  constructor(private fb: FormBuilder, private stateService: StateService) { 
    this.stateForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]]
    });
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

    // needs change
    this.stateService.addState(this.stateForm.get('name')?.value); // tiene que devolver un estado
    this.newState.emit() // tengo que pasar un estado
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