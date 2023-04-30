import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLogged: boolean = true;

  // user: User = {
  //   name: 'sara',
  //   email: 'saragonza.lez0608@gmail.com',
  //   password: 'Hola!9'
  // }

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['']);
  }

  goProfile() {
    this.router.navigate(['profile']);
  }

  onLogin() {
    this.router.navigate(['login']);
  }

  onSignUp() {
    this.router.navigate(['signup']);
  }
}