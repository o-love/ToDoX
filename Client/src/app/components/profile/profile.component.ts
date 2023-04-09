import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from 'src/app/validators/password.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  emailForm: FormGroup;
  passwordForm: FormGroup;

  userEmail: string = 'ejemplo@ejemplo.com';
  userPassword: string = 'Hola!9';

  darkMode: boolean = false;

  @ViewChildren('email') emailLabels!: QueryList<ElementRef>;
  @ViewChild('currentEmailLabel') currentEmailLabel!: ElementRef;
  @ViewChild('newEmailLabel') newEmailLabel!: ElementRef;

  @ViewChildren('password') passwordLabels!: QueryList<ElementRef>;
  @ViewChild('oldPasswordLabel') oldPasswordLabel!: ElementRef;
  @ViewChild('newPasswordLabel') newPasswordLabel!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      currentEmail: [this.userEmail],
      newEmail: ['', [Validators.required, Validators.email]]
    })

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required], PasswordValidator.strong()]
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
		if (!this.checkErrors(this.emailForm, this.emailLabels)) {
      this.userEmail = this.emailForm.get('newEmail')?.value;
      this.emailForm.setValue({currentEmail: this.userEmail, newEmail: ''});
    }
  }

  checkPassword(): boolean {
    if (this.userPassword != this.passwordForm.get('oldPassword')?.value) {
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
      this.userPassword = this.passwordForm.get('newPassword')?.value;
      this.passwordForm.reset();
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    console.log("Modo oscuro:", this.darkMode ? "Activado" : "Desactivado");
  }
}
