import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { State } from 'src/app/models/state';

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.scss']
})
export class StateListComponent implements OnInit {

  @Input() selectedState: State | null = null;
  @Input() states: State[] | null = null;

  @Output() close = new EventEmitter<void>;
  @Output() state = new EventEmitter<State>;

  @ViewChildren('check') checks!: QueryList<HTMLElement>;
  statesListId: {[key: number]: number} = {};
  selectedElement: HTMLElement | null = null;

  constructor() {}

  ngOnInit(): void {
    if (this.states) {
      this.states.forEach((state, index) => {
        this.statesListId[state.id] = index;
      })
    }
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     console.log(this.checks);
  //     this.checks.forEach((check, index) => {
  //       console.log(check, index);
  //       if (this.selectedState) if (index == this.statesListId[this.selectedState.id]) {
  //         if (check) {
  //           this.toggleClear(check);
  //           this.toggleCheck(check);
  //         }
  //       }
  //     })
  //   }, 2000); 
  // }

  onClose() {
    this.close.emit();
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
    element.classList.toggle('bi-check-square-fill');
  }
  
  fill(element: HTMLElement, pass: boolean) {
    if (this.selectedElement && !pass) if (element == this.selectedElement) return;
    this.toggleClear(element);
    this.toggleFill(element);
  }

  selectState(element: HTMLElement, state: State) {
    if (this.selectedElement && this.selectedState) {
      this.toggleCheck(this.selectedElement);
      this.toggleClear(this.selectedElement);
      
      if (this.selectedState.id == state.id) {
        this.fill(this.selectedElement, true);
        this.selectedState = null;
        this.selectedElement = null;
        return;
      }
    }
    
    if (element.classList.contains('bi-square-fill')) this.toggleFill(element);
    if (element.classList.contains('bi-square-clear')) this.toggleClear(element);
    this.toggleCheck(element);
    this.selectedState = state;
    this.selectedElement = element;
    this.state.emit(this.selectedState);
  }
}