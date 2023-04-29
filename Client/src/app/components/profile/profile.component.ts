import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { UserAuthService } from 'src/app/services/user-auth-service/user-auth.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  emailForm: FormGroup;
  passwordForm: FormGroup;

  user!: User;
  userEmail: string = 'ejemplo@ejemplo.com';
  userPassword: string = 'Hola!9';

  darkMode: boolean = false;

  @ViewChildren('email') emailLabels!: QueryList<ElementRef>;
  @ViewChild('currentEmailLabel') currentEmailLabel!: ElementRef;
  @ViewChild('newEmailLabel') newEmailLabel!: ElementRef;

  @ViewChildren('password') passwordLabels!: QueryList<ElementRef>;
  @ViewChild('oldPasswordLabel') oldPasswordLabel!: ElementRef;
  @ViewChild('newPasswordLabel') newPasswordLabel!: ElementRef;

  constructor(private router: Router, private fb: FormBuilder, private authService: UserAuthService) {
    this.emailForm = this.fb.group({
      currentEmail: ['', Validators.required],
      newEmail: ['', [Validators.required, Validators.email]]
    })

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required], PasswordValidator.strong()]
      // confirmPassword: ['', [Validators.required, PasswordValidator.match('newPassword')]] 
    })
  }

  ngOnInit() {
    this.authService.getMyUser().subscribe((response) => {
      console.log("User", response);
      this.user = response;
      this.emailForm.controls['currentEmail'].setValue(response.email);
      // this.passwordForm.controls['oldPassword'].setValue(response.password);
    });    
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
      
      if (this.user && this.userEmail) {
        const user: User = { id: this.user.id, name: this.user.name, email: this.userEmail };
        this.authService.updateUser(user).subscribe((response) => {
          console.log(response);
          this.userEmail = response.email;
          this.emailForm.setValue({ currentEmail: this.userEmail, newEmail: '' });
        });
      }
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

      // this.authService.updatePassword(this.userPassword).subscribe((response) => {
      //   console.log("Changing password", response);
      //   this.passwordForm.reset();
      // });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/..']);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    console.log("Modo oscuro:", this.darkMode ? "Activado" : "Desactivado");
  }
}
