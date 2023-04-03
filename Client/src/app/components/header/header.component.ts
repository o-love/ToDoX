import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() showLoginButton: boolean = false;

  constructor(private router: Router, private translate: TranslateService) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    console.log('showLoginButton:', this.showLoginButton);
  }

  goHome() {
    this.router.navigate(['/home']);
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

  switchLanguage() {
    this.translate.use(this.translate.currentLang === 'en' ? 'es' : 'en');
  }
}
