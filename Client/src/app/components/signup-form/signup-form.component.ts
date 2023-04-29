import { Component, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { Form } from 'src/app/models/form';
import { UserAuthService } from 'src/app/services/user-auth-service/user-auth.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements Form {
  signupForm: FormGroup;

  @ViewChildren('label') labels!: QueryList<ElementRef>;
  @ViewChild('nameLabel') nameLabel!: ElementRef;
  @ViewChild('emailLabel') emailLabel!: ElementRef;
  @ViewChild('passwordLabel') passwordLabel!: ElementRef;
  @ViewChild('repeatPasswordLabel') repeatPasswordLabel!: ElementRef;

  constructor(private router: Router, private fb: FormBuilder, private authService: UserAuthService) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required, PasswordValidator.strong()],
      repeatPassword: ['', Validators.required]
    });
  }

  checkErrors(): boolean {
    let errors: boolean = false;

    this.labels.forEach((label, index) => {
      const control = this.signupForm.controls[Object.keys(this.signupForm.controls)[index]];

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

  match(): boolean {
    if (this.signupForm.get('password')?.value != this.signupForm.get('repeatPassword')?.value) {
      this.onError(this.repeatPasswordLabel);
      return false;
    }
    return true;
  }

  goBack() {
    this.router.navigate(['/..']);
  }

  onSubmit() {
    this.authService.register(
      this.signupForm.value.name,
      this.signupForm.value.email,
      this.signupForm.value.password
    ).subscribe(
      (response) => {
        console.log(response);
        this.resetErrors();
        if (!this.checkErrors() && this.match()) {
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}