import { Component, ElementRef, EventEmitter, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-layout-selector',
  templateUrl: './layout-selector.component.html',
  styleUrls: ['./layout-selector.component.scss']
})
export class LayoutSelectorComponent {

  @ViewChild('title') selectTitle!: ElementRef;
  @ViewChild('icon') dropdownIcon!: ElementRef;
  @ViewChild('select') select!: ElementRef;

  @ViewChildren('option') options!: QueryList<ElementRef>;
  @ViewChild('table') tableOption!: ElementRef;
  @ViewChild('kanban') kanbanOption!: ElementRef;

  @Output() selection: EventEmitter<number> = new EventEmitter();

  selectLayout(selected_option: ElementRef) {
    this.options.forEach((option, index) => {
      if (option.nativeElement.classList.contains('checked')) {
        option.nativeElement.classList.toggle('checked');
        this.selection.emit(index);
      }  
    });

    this.selectTitle.nativeElement.innerText = selected_option.nativeElement.innerText;

    this.options.forEach((option, index) => {
      if (option.nativeElement.innerText == selected_option.nativeElement.innerText) {
        option.nativeElement.classList.toggle('checked');
        this.selection.emit(index);
      }
    });

    this.selectActive();
  }

  selectActive() {
    this.dropdownIcon.nativeElement.classList.toggle('icon-arrow-down');
    this.dropdownIcon.nativeElement.classList.toggle('icon-arrow-up');
    this.select.nativeElement.classList.toggle('closed');
  }  
}