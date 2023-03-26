import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  currentEmail: string;
  newEmail: string;
  currentPassword: string;
  newPassword: string;
  darkMode: boolean = false;

  constructor() {
    this.currentEmail = "ejemplo@ejemplo.com";
    this.newEmail = "";
    this.currentPassword = "";
    this.newPassword = "";
  }

  saveEmail() {
    console.log("Correo electrónico guardado:", this.newEmail);
    this.currentEmail = this.newEmail;
    this.newEmail = "";
  }

  savePassword() {
    console.log("Contraseña guardada:", this.newPassword);
    this.currentPassword = this.newPassword;
    this.newPassword = "";
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    console.log("Modo oscuro:", this.darkMode ? "Activado" : "Desactivado");
  }
}
