import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() showLoginButton: boolean = false;
  
  constructor(private router: Router) {
    
  }

  ngOnInit() {
    console.log('showLoginButton:', this.showLoginButton);
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