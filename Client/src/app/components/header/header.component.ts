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
  selectedLang: string;

  constructor(private router: Router, public translate: TranslateService) {
    this.translate.addLangs(['en', 'es', 'de', 'it', 'pt']);
    const storedLang = localStorage.getItem('selectedLang');
    if (storedLang) {
      this.selectedLang = storedLang;
      this.translate.use(storedLang);
    } else {
      this.selectedLang = 'en';
      this.translate.setDefaultLang('en');
      this.translate.use('en');
    }
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
    this.translate.use(this.selectedLang);
    localStorage.setItem('selectedLang', this.selectedLang);
  }
}
