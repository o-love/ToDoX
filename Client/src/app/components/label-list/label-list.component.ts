import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Label } from 'src/app/models/label';
import { LabelService } from 'src/app/services/label/label.service';

@Component({
  selector: 'app-label-list',
  templateUrl: './label-list.component.html',
  styleUrls: ['./label-list.component.scss']
})
export class LabelListComponent implements OnChanges {

  @Input() selectedLabels: Label[] = [];
  @Input() canEdit: boolean = false;
  @Input() select: boolean = true;

  @Output() close = new EventEmitter<void>();
  @Output() changes = new EventEmitter<void>();
  @Output() labels = new EventEmitter<Label[]>();
  @Output() new = new EventEmitter<void>();

  boardId = this.route.snapshot.paramMap.get('boardId');
  taskListId = this.route.snapshot.paramMap.get('listId');
  labelList: Label[] | undefined;

  @ViewChildren('dropdown') dropdown!: QueryList<ElementRef>;
  @ViewChild('element') element!: HTMLElement;
  options: {[key: number]: boolean } = {};
  labelOpened: number | null = null;
  
  constructor(private route: ActivatedRoute, private labelService: LabelService) {}

  ngOnChanges() {
    this.getLabels();
  }

  onChanges() {
    this.changes.emit();
  }

  private getLabels() {
    if (!this.boardId || !this.taskListId) return;
    console.log('loading labels...');
    this.labelService.getLabelsByTaskListId(this.boardId, this.taskListId).then(
      (labels: Label[]) => {
        this.labelList = labels;
      }
    )
  }

  hexToRgb(hex: string): string {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  }

  getColor(key: string): string | undefined {
    return this.labelService.getColor(key);
  }

  getBackgroundColor(color: string): string {
    let backgroundColor = this.getColor(color);
    if (!backgroundColor) backgroundColor = '#474269';
    backgroundColor = 'rgba(' + this.hexToRgb(backgroundColor) + ', .4)';
    return backgroundColor;
  }

  editLabel(label: Label) {
    if (!this.boardId || !this.taskListId) return;
    console.log('editing label %d...', label.id);
    this.labelService.editLabel(this.taskListId, label.id, { name: label.name, description: label.description, color: label.color }).then(
      (label: Label) => {
        this.getLabels();
        this.onChanges();
      }
    )
  }

  deleteLabel() {
    this.changes.emit();
    this.close.emit();
  }
  
  addNew() {
    this.new.emit();
    this.close.emit();
  }

  updateOptions() {
    if (this.labelList) this.labelList.forEach((label) => this.options[label.id] = false);
    if (this.selectedLabels) this.selectedLabels.forEach((label) => this.options[label.id] = true);
  }

  openLabel(element: HTMLElement | undefined, label: number) {
    if (element == undefined) return;
    this.dropdown.forEach((icon) => {
      if (icon.nativeElement != element && icon.nativeElement.classList.contains('bi-chevron-up')) this.toggleDropdown(icon.nativeElement);
    })

    this.toggleDropdown(element);
    if (element.classList.contains('bi-chevron-up')) this.labelOpened = label;
    else this.labelOpened = null;
  }

  onClose() {
    this.close.emit();
  }

  toggleDropdown(element: HTMLElement) {
    element.classList.toggle('bi-chevron-down');
    element.classList.toggle('bi-chevron-up');
  }

  selectLabel(label: Label) {
    this.selectedLabels.push(label);
    this.labels.emit(this.selectedLabels);
  }
}