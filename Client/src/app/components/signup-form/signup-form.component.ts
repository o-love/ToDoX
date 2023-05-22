import { Component, ViewChild, ElementRef, ViewChildren, QueryList, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { Form } from 'src/app/models/form';
import { UserAuthService } from 'src/app/services/user-auth/user-auth.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements Form, OnInit {
  signupForm: FormGroup;
  @ViewChildren('label') labels!: QueryList<ElementRef>;
  @ViewChild('nameLabel') nameLabel!: ElementRef;
  @ViewChild('emailLabel') emailLabel!: ElementRef;
  @ViewChild('passwordLabel') passwordLabel!: ElementRef;
  @ViewChild('repeatPasswordLabel') repeatPasswordLabel!: ElementRef;

  loading: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private authService: UserAuthService) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(70)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(70)]],
      password: ['', [Validators.required, PasswordValidator.strong(), Validators.maxLength(70)]],
      repeatPassword: ['', [Validators.required, Validators.maxLength(70)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) this.router.navigate(['/profile']); 
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

  private match(): boolean {
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
    console.log("trying to create account...");
    this.resetErrors();
    if (this.checkErrors() || !this.match()) return;

    this.loading = true;
    this.authService.register(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
    .then(
      (response) => this.router.navigate(['/profile'])
    );
  }
}