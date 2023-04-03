import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';

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
  error: boolean = false;

  @ViewChild('emailLabel') emailLabel!: ElementRef;
  @ViewChild('passwordLabel') passwordLabel!: ElementRef;

  constructor(private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
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

  onError(label: ElementRef) {
    this.error = true;
    label.nativeElement.style.boxShadow = '0px 0px 7px rgba(255, 113, 113)';
  }

  resetErrors() {
    this.error = false;
    this.emailLabel.nativeElement.style.boxShadow = 'none';
    this.passwordLabel.nativeElement.style.boxShadow = 'none';
  }

  goBack() {
    this.router.navigate(['/..']);
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    console.log(this.loginForm.value);

    if (this.error) this.resetErrors();

    const emailErrors: ValidationErrors | null | undefined = this.loginForm.get('email')?.errors;
    const passwordErrors: ValidationErrors | null | undefined = this.loginForm.get('password')?.errors;

    if (emailErrors || passwordErrors) {
      if (emailErrors) this.onError(this.emailLabel);
      if (passwordErrors) this.onError(this.passwordLabel);
    } else this.router.navigate(['/boards']);
  }
}