import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user-service.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router, private userService: UserService) {}

  showLoginButton() {
    return !this.userService.isLogged();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goProfile() {
    this.router.navigate(['./profile']);
  }

  onLogin() {
    this.router.navigate(['./login']);
  }

  onSignUp() {
    this.router.navigate(['./signup']);
  }
}