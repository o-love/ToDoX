import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Label } from 'src/app/models/label';

@Component({
  selector: 'app-label-list',
  templateUrl: './label-list.component.html',
  styleUrls: ['./label-list.component.scss']
})
export class LabelListComponent implements OnInit {

  selectedElements: HTMLElement[] = [];
  @Input() selectedLabels: Label[] | null = null;
  @Input() labels: Label[] = [];

  @Output() closeLabel = new EventEmitter<void>;
  @Output() label = new EventEmitter<Label[]>;

  @ViewChildren('check') checks!: QueryList<HTMLElement>;
  labelsListId: {[key: number]: number} = {};
  

  constructor() {}

  ngOnInit() {
    if (this.labels) {
      this.labels.forEach((label, index) => {
        this.labelsListId[label.id] = index;
      })
    }
  }

  onClose() {
    this.closeLabel.emit();
  }

  toggleDropdown(element: HTMLElement) {
    element.classList.toggle('bi-chevron-down');
    element.classList.toggle('bi-chevron-up');
  }

  toggleClear(element: HTMLElement) {
    element.classList.toggle('bi-square');
  }

  toggleFill(element: HTMLElement) {
    element.classList.toggle('bi-square-fill');
  }

  toggleCheck(element: HTMLElement) {
    element.classList.toggle('bi-check-square-fill')
  }

  fill(element: HTMLElement, pass: boolean) {
    if (this.selectedElements.length > 0 && !pass) if (this.selectedElements.includes(element)) return;
    this.toggleClear(element);
    this.toggleFill(element);
  }

  selectLabel(element: HTMLElement, label: Label) {
    if (this.selectedElements.length > 0 && this.selectedLabels) {
      for (let i = 0; i < this.selectedLabels.length; i++) {
        if (this.selectedLabels[i].id == label.id) {
          this.fill(element, true);
          this.selectedLabels.slice(i, 1);
          this.selectedElements.slice(this.selectedElements.indexOf(element), 1);
          this.label.emit(this.selectedLabels);
          return;
        }
      }
    }

    if (element.classList.contains('bi-square-fill')) this.toggleFill(element);
    if (element.classList.contains('bi-square')) this.toggleClear(element);
    this.toggleCheck(element);
    if (this.selectedLabels) { 
      this.selectedLabels.push(label);
      this.selectedElements.push(element);
      this.label.emit(this.selectedLabels);
    }
  }
}