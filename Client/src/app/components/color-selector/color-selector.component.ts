import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { LabelService } from 'src/app/services/label/label.service';

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent implements AfterViewInit {

  @ViewChild('select') select!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('icon') dropdown_icon!: ElementRef;

  @ViewChildren('option') options!: QueryList<ElementRef>;
  @ViewChildren('color') colors!: QueryList<ElementRef>

  @Input() color: string | undefined;
  @Output() selection: EventEmitter<number> = new EventEmitter();

  constructor(private labelService: LabelService) {}

  ngAfterViewInit(): void {
    let colorsValue = this.labelService.getColorsValue();

    this.colors.forEach((element, index) => {
      if (index < colorsValue.length) element.nativeElement.style.color = colorsValue[index];
    })

    if (this.color) {
      let initialColor = this.getInitialColor(this.color); 
      if (initialColor) this.selectColor(initialColor.element, initialColor.i, false);
    }  
  }

  getInitialColor(color: string): any {
    let initial: any;
    this.options.forEach((option, index) => {
      if (option.nativeElement.innerText == color) initial = { element: option.nativeElement, i: index };
    })
    return initial;
  }

  selectActive() {
    this.dropdown_icon.nativeElement.classList.toggle('bi-chevron-down');
    this.dropdown_icon.nativeElement.classList.toggle('bi-chevron-up');
    this.select.nativeElement.classList.toggle('closed');
  }

  selectColor(element: HTMLElement, i: number, emit: boolean) {
    this.options.forEach((option) => {
      if (option.nativeElement.classList.contains('checked')) {
        option.nativeElement.classList.toggle('checked');
      }
    })

    this.title.nativeElement.innerText = element.innerText;
    element.classList.toggle('checked');
    console.log('checked \'%s\': %d', element.innerText, i);
    if (!emit) return;
    this.selection.emit(i);
    this.selectActive();
  }
}