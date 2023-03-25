import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent {
  signupForm: FormGroup;
  name: string = '';
  email: string = '';
  password: string = '';
  repeatPassword: string = '';
  isFocused: boolean = false;

  @ViewChild('nameLabel') nameLabel!: ElementRef;
  @ViewChild('emailLabel') emailLabel!: ElementRef;
  @ViewChild('passwordLabel') passwordLabel!: ElementRef;
  @ViewChild('repeatPasswordLabel') repeatPasswordLabel!: ElementRef;

  constructor(private router: Router, private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    });
  }

  onFocus(event: any, label: any) {
    this.isFocused = true;
    label.classList.add('focused');
  }

  onBlur(event: any, label: any) {
    if (!event.target.value) {
      this.isFocused = false;
      label.classList.remove('focused');
    }
  }

  goBack() {
    this.router.navigate(['/..']);
  }

  onSubmit() {
    console.log(this.signupForm.value);
    this.router.navigate(['/login']);
  }
}
