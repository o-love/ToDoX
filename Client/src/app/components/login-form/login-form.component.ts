import { Component, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { Form } from 'src/app/models/form';
import { UserAuthService } from 'src/app/services/user-auth-service/user-auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements Form {  
  loginForm: FormGroup;

  @ViewChildren('label') labels!: QueryList<ElementRef>;
  @ViewChild('nameLabel') nameLabel!: ElementRef;
  @ViewChild('emailLabel') emailLabel!: ElementRef;

  constructor(private router: Router, private fb: FormBuilder, private authService: UserAuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required, PasswordValidator.strong()]
    });
  }

  checkErrors(): boolean {
    let errors: boolean = false;

    this.labels.forEach((label, index) => {
      const control = this.loginForm.controls[Object.keys(this.loginForm.controls)[index]];

      if (control.errors) {
        this.onError(label);
        errors = true;
      }
    })

    return errors;
  }

  resetErrors() {
    this.labels.forEach((label) => {
			label.nativeElement.style.boxShadow = 'none';
		});
  }

  onError(label: ElementRef) {
    label.nativeElement.style.boxShadow = '0px 0px 7px rgb(255, 113, 113)';
  }

  onFocus(event: any, label: any) {
    label.classList.add('focused');
  }

  onBlur(event: any, label: any) {
    if (!event.target.value) label.classList.remove('focused');
  }

  goBack() {
    this.router.navigate(['/..']);
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {    
    console.log("Trying to log in")
    this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    ).subscribe(
      (response) => {
        console.log("Logged in", response);
        this.resetErrors();
        if (!this.checkErrors()) {
          this.router.navigate(['/profile']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }  
}