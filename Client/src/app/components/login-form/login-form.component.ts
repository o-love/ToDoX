import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {  
  loginForm: FormGroup;
  email: string = '';
  password: string = '';
  isFocused: boolean = false;

  @ViewChild('emailLabel') emailLabel!: ElementRef;
  @ViewChild('passwordLabel') passwordLabel!: ElementRef;

  constructor(private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
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

  onRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.router.navigate(['/boards']);
  }
}