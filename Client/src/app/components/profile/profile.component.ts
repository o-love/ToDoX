import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { UserAuthService } from 'src/app/services/user-auth-service/user-auth.service';
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
  userEmail: string = '';
  userPassword: string = '';
  darkMode: boolean = false;

  // user: User = {
  //   name: 'sara',
  //   email: 'saragonza.lez0608@gmail.com',
  //   password: 'Hola!9'
  // }

  @ViewChildren('email') emailLabels!: QueryList<ElementRef>;
  @ViewChild('currentEmailLabel') currentEmailLabel!: ElementRef;
  @ViewChild('newEmailLabel') newEmailLabel!: ElementRef;

  @ViewChildren('password') passwordLabels!: QueryList<ElementRef>;
  @ViewChild('oldPasswordLabel') oldPasswordLabel!: ElementRef;
  @ViewChild('newPasswordLabel') newPasswordLabel!: ElementRef;

  constructor(private router: Router, private fb: FormBuilder, private authService: UserAuthService) {
    this.emailForm = this.fb.group({
      currentEmail: ['', Validators.required],
      newEmail: ['', [Validators.required, Validators.email, Validators.maxLength(70)]]
    })

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, PasswordValidator.strong(), Validators.maxLength(70)]]
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
      this.emailForm.setValue({ currentEmail: this.userEmail, newEmail: '' });

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
    // if (this.user && this.user.password != this.passwordForm.get('oldPassword')?.value) {
    //   this.onError(this.oldPasswordLabel);
    //   return false;
    // }

    return true;
  }

  savePassword() {
    const oldPassword = this.passwordForm.value.oldPassword;
    const newPassword = this.passwordForm.value.newPassword;
    console.log("Entrando al auth");
    this.authService.updatePassword(newPassword).subscribe(
      response => {
        // alert('Contraseña actualizada exitosamente.');
        // localStorage.setItem('token', response.token.split('|')[1]);
      },
      error => {
        console.log(error);
      });
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
