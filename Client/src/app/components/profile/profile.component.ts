import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { UserAuthService } from 'src/app/services/user-auth/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  infoForm: FormGroup;
  emailForm: FormGroup;
  passwordForm: FormGroup;

  user: User | null = null;
  darkMode: boolean = false;

  @ViewChildren('email') emailLabels!: QueryList<ElementRef>;
  @ViewChild('currentEmailLabel') currentEmailLabel!: ElementRef;
  @ViewChild('newEmailLabel') newEmailLabel!: ElementRef;

  @ViewChildren('password') passwordLabels!: QueryList<ElementRef>;
  @ViewChild('oldPasswordLabel') oldPasswordLabel!: ElementRef;
  @ViewChild('newPasswordLabel') newPasswordLabel!: ElementRef;

  @ViewChildren('info') infoLabels!: QueryList<ElementRef>;

  disabled: boolean = true;
  loading_email: boolean = false;
  loading_password: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private authService: UserAuthService) {
    this.infoForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(60)]]
    })

    this.emailForm = this.fb.group({
      currentEmail: ['', Validators.required],
      newEmail: ['', [Validators.required, Validators.email, Validators.maxLength(70)]]
    })

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, PasswordValidator.strong(), Validators.maxLength(70)]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(70)]] 
    })
  }

  ngOnInit() {
    console.log('profile init');
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.infoForm.controls['name'].disable();
    this.getMyUser();    
  }

  private getMyUser(): void {
    console.log('loading my user...');
    this.authService.getMyUser().then(
      (user: User) => {
        console.log("my user:", user);
        if (!user) this.router.navigate(['/login']);
        this.user = user;
        this.emailForm.controls['currentEmail'].setValue(user.email);
        this.infoForm.controls['name'].setValue(user.name);
      }
    );
  }

  onError(label: ElementRef) {
    label.nativeElement.style.boxShadow = '0px 0px 7px rgb(255, 113, 113)';
  }

  toggleDisable() {
    this.disabled = !this.disabled;
    if (this.disabled) this.infoForm.controls['name'].disable();
    else this.infoForm.controls['name'].enable();
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
    labels.forEach((label) => label.nativeElement.style.boxShadow = 'none');
  }

  saveEmail() {
    console.log('updating email...');

    this.resetErrors(this.emailLabels);
    if (this.checkErrors(this.emailForm, this.emailLabels) || !this.user) {
      if (!this.user) console.log('user doesn\'t exist');
      return;
    } 

    const user: User = { id: this.user.id, name: this.user.name, email: this.emailForm.value.newEmail };
    this.loading_email = true;
    this.authService.updateUser(user).then(
      (user: User) => {
        this.emailForm.reset();
        this.getMyUser();
        this.loading_email = false;
      } 
    );
  }

  savePassword() {
    console.log("updating password...");

    this.resetErrors(this.passwordLabels);
    if (this.checkErrors(this.passwordForm, this.passwordLabels)) return;

    let oldPassword: string = this.passwordForm.value.oldPassword;
    let newPassword: string = this.passwordForm.value.newPassword;

    this.loading_password = true;
    this.authService.updatePassword(oldPassword, newPassword).then(
      (response: boolean) => {
        if (response) console.log('password updated succesfully');
        else {
          console.log('password not updated');
          this.onError(this.oldPasswordLabel);
        }
        // localStorage.setItem('token', response.token.split('|')[1]);
        this.passwordForm.reset();
        this.loading_password = false;
      }
    );
  }

  saveInfo() {
    console.log('updating user...');
    
    this.resetErrors(this.infoLabels);
    if (this.checkErrors(this.infoForm, this.infoLabels) || !this.user) return;

    this.user.name = this.infoForm.value.name;
    this.toggleDisable();
    this.authService.updateUser(this.user).then(
      (user: User) => {
        console.log('user updated:', user); 
        this.getMyUser();
      }
    )
  }

  logout() {
    console.log('loging out');
    this.authService.logout();
    this.router.navigate(['/..']);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    console.log("Modo oscuro:", this.darkMode ? "Activado" : "Desactivado");
  }
}