import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {
  selectedLang: string;

  constructor(public translate: TranslateService) {
    this.translate.addLangs(['en', 'es', 'de', 'it', 'pt']);
    const storedLang = localStorage.getItem('selectedLang');

    if (storedLang) this.selectedLang = storedLang;
    else {
      this.selectedLang = 'en';
      this.translate.setDefaultLang('en');
    }

    this.translate.use(this.selectedLang);
  }

  switchLanguage() {
    this.translate.use(this.selectedLang);
    localStorage.setItem('selectedLang', this.selectedLang);
  }
}