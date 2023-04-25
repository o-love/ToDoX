import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {
  selectedLang: string = 'en';

  @ViewChild('icon') dropdownIcon!: ElementRef<any>;
  @ViewChild('select') select!: ElementRef<any>;

  langs: string[] = ['en', 'es', 'de', 'it', 'pt'];

  constructor(public translate: TranslateService) {
    this.translate.addLangs(this.langs);
    const storedLang = localStorage.getItem('selectedLang');

    if (storedLang) this.selectedLang = storedLang;
    else this.selectedLang = 'en';

    this.translate.use(this.selectedLang);
  }

  selectLang(lang: string) {
    this.selectedLang = lang;
    this.translate.use(this.selectedLang);

    this.selectActive();
  }

  selectActive() {
    this.dropdownIcon.nativeElement.classList.toggle('icon-arrow-down');
    this.dropdownIcon.nativeElement.classList.toggle('icon-arrow-up');
    this.select.nativeElement.classList.toggle('closed');
  }
}