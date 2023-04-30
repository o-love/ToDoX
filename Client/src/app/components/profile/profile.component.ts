import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { PasswordValidator } from 'src/app/validators/password.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  emailForm: FormGroup;
  passwordForm: FormGroup;

  darkMode: boolean = false;

  user: User = {
    name: 'sara',
    email: 'saragonza.lez0608@gmail.com',
    password: 'Hola!9'
  }

  @ViewChildren('email') emailLabels!: QueryList<ElementRef>;
  @ViewChild('currentEmailLabel') currentEmailLabel!: ElementRef;
  @ViewChild('newEmailLabel') newEmailLabel!: ElementRef;

  @ViewChildren('password') passwordLabels!: QueryList<ElementRef>;
  @ViewChild('oldPasswordLabel') oldPasswordLabel!: ElementRef;
  @ViewChild('newPasswordLabel') newPasswordLabel!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      currentEmail: [this.user?.email],
      newEmail: ['', [Validators.required, Validators.email, Validators.maxLength(70)]]
    })

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, PasswordValidator.strong(), Validators.maxLength(70)]]
    })
  }

  onError(label: ElementRef) {
    label.nativeElement.style.boxShadow = '0px 0px 7px rgb(255, 113, 113)';
  }

  checkErrors(form: FormGroup, labels: QueryList<ElementRef>): boolean {
    let errors: boolean = false;

    labels.forEach((label, index) => {
      const control = form.controls[Object.keys(form.controls)[index]];

      if (control.errors) {
        this.onError(label);
        errors = true;
      }
    })

    return errors;
  }

  resetErrors(labels: QueryList<ElementRef>) {
    labels.forEach((label) => {
			label.nativeElement.style.boxShadow = 'none';
		});
  }

  saveEmail() {
    console.log(this.emailForm.value);

    this.resetErrors(this.emailLabels);
		if (!this.checkErrors(this.emailForm, this.emailLabels) && this.user) {
      this.user.email = this.emailForm.get('newEmail')?.value.toString();
      this.emailForm.setValue({currentEmail: this.user.email, newEmail: ''});
    }
  }

  checkPassword(): boolean {
    if (this.user && this.user.password != this.passwordForm.get('oldPassword')?.value) {
      this.onError(this.oldPasswordLabel);
      return false;
    }

    return true;
  }

  savePassword() {
    console.log(this.passwordForm.value);

    this.resetErrors(this.passwordLabels);
    
    let check: boolean = this.checkPassword();
    if (!this.checkErrors(this.passwordForm, this.passwordLabels) && check) {
      if (this.user) this.user.password = this.passwordForm.get('newPassword')?.value;
      this.passwordForm.reset();
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    console.log("Modo oscuro:", this.darkMode ? "Activado" : "Desactivado");
  }
}
