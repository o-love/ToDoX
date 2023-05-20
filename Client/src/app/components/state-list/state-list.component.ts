import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { State } from 'src/app/models/state';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.scss']
})
export class StateListComponent implements OnChanges {

  @Input() selectedState: State | null = null;
  @Input() canEdit: boolean = false;
  @Input() select: boolean = true;

  @Output() close = new EventEmitter<void>();
  @Output() changes = new EventEmitter<void>();
  @Output() state = new EventEmitter<State>();
  @Output() new = new EventEmitter<void>();

  boardId = this.route.snapshot.paramMap.get('boardId');
  taskListId = this.route.snapshot.paramMap.get('listId');
  states: State[] | undefined;

  @ViewChildren('dropdown') dropdown!: QueryList<ElementRef>;
  @ViewChild('element') element!: HTMLElement;

  options: {[key: number]: boolean } = {};

  stateOpened: number | null = null;

  constructor(private route: ActivatedRoute, private stateService: StateService) {}

  ngOnChanges() {
    this.getStates();
  }

  onClose() {
    this.close.emit();
  }

  onChanges() {
    this.changes.emit();
  }

  getStates() {
    if (!this.boardId || !this.taskListId) return;
    console.log('loading states...');
    this.stateService.getStatesByTaskListId(this.boardId, this.taskListId).then(
      (states: State[]) => {
        this.states = states;
        this.updateOptions();
      }
    )
  }

  editState(state: State) {
    if (!this.boardId || !this.taskListId) return;
    console.log('editing state %d...', state.id);
    this.stateService.editState(this.taskListId, state.id, state.name).then(
      (state: State) => {
        this.getStates() 
        this.onChanges()
      }
    )
  }

  deleteState() {
    this.changes.emit();
    this.close.emit();
  }

  addNew() {
    this.new.emit();
    this.close.emit();
  }

  updateOptions() {
    if (this.states) this.states.forEach((state) => {
      if (this.selectedState?.id == state.id) this.options[state.id] = true;
      else this.options[state.id] = false;
    });
  }

  openState(element: HTMLElement | undefined, state: number) {
    if (element == undefined) return;
    this.dropdown.forEach((label) => {
      if (label.nativeElement != element && label.nativeElement.classList.contains('bi-chevron-up')) this.toggleDropdown(label.nativeElement);
    })
    this.toggleDropdown(element);
    if (element.classList.contains('bi-chevron-up')) this.stateOpened = state;
    else this.stateOpened = null;
  }

  toggleDropdown(element: HTMLElement) {
    element.classList.toggle('bi-chevron-down');
    element.classList.toggle('bi-chevron-up');
  }

  selectState(state: State) {
    this.selectedState = state;
    this.state.emit(this.selectedState);
  }
}