import { AfterViewInit, Component, ElementRef, EventEmitter, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
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

  @Output() selection: EventEmitter<number> = new EventEmitter();

  constructor(private labelService: LabelService) {}

  ngAfterViewInit(): void {
    let colorsValue = this.labelService.getColorsValue();

    this.colors.forEach((element, index) => {
      if (index < colorsValue.length) element.nativeElement.style.color = colorsValue[index];
    })
  }

  selectActive() {
    this.dropdown_icon.nativeElement.classList.toggle('bi-chevron-down');
    this.dropdown_icon.nativeElement.classList.toggle('bi-chevron-up');
    this.select.nativeElement.classList.toggle('closed');
  }

  selectColor(element: HTMLElement, i: number) {
    this.options.forEach((option, index) => {
      if (option.nativeElement.classList.contains('checked')) {
        option.nativeElement.classList.toggle('checked');
      }
    })

    this.title.nativeElement.innerText = element.innerText;
    element.classList.toggle('checked');
    console.log('checked \'%s\': %d', element.innerText, i);
    this.selection.emit(i);
    this.selectActive();
  }
}