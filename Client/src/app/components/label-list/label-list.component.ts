import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { Label } from 'src/app/models/label';

@Component({
  selector: 'app-label-list',
  templateUrl: './label-list.component.html',
  styleUrls: ['./label-list.component.scss']
})
export class LabelListComponent {

  @Input() selectedLabel: Label | null = null;
  @Input() labels: Label[] | null = null;

  @Output() close = new EventEmitter<void>;
  @Output() label = new EventEmitter<Label>;

  @ViewChildren('check') checks!: QueryList<HTMLElement>;
  labelsListId: {[key: number]: number} = {};
  selectedElement: HTMLElement | null = null;

  constructor() {}

  onClose() {

  }
}