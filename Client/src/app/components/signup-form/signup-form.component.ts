import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { PasswordValidator } from 'src/app/validators/password.validator';

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
  error: boolean = false;

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

  onError(label: ElementRef) {
    this.error = true;
    label.nativeElement.style.boxShadow = '0px 0px 7px rgba(255, 113, 113)';
  }

  resetErrors() {
    this.error = false;
    this.nameLabel.nativeElement.style.boxShadow = 'none';
    this.emailLabel.nativeElement.style.boxShadow = 'none';
    this.passwordLabel.nativeElement.style.boxShadow = 'none';
    this.repeatPasswordLabel.nativeElement.style.boxShadow = 'none';
  }

  goBack() {
    this.router.navigate(['/..']);
  }

  onSubmit() {
    console.log(this.signupForm.value);

    if (this.error) this.resetErrors();

    const nameErrors: ValidationErrors | null | undefined = this.signupForm.get('name')?.errors;
    const emailErrors: ValidationErrors | null | undefined = this.signupForm.get('email')?.errors;
    const passwordErrors: ValidationErrors | null | undefined = this.signupForm.get('password')?.errors;
    const repeatPasswordErrors: ValidationErrors | null | undefined = this.signupForm.get('repeatPassword')?.errors;

    if (nameErrors || emailErrors || passwordErrors || repeatPasswordErrors) {
      if (nameErrors) this.onError(this.nameLabel);
      if (emailErrors) this.onError(this.emailLabel);
      if (passwordErrors) this.onError(this.passwordLabel);
      if (repeatPasswordErrors) this.onError(this.repeatPasswordLabel);
    } else this.router.navigate(['/profile']);
  }
}
