import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserAuthService } from 'src/app/services/user-auth-service/user-auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router, public userService: UserAuthService) {}

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