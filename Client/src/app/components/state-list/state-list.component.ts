import { Component, Input } from '@angular/core';
import { State } from 'src/app/models/state';

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.scss']
})
export class StateListComponent {

  // @Input() states: State[] | null = null;
  states: State[];
  
  constructor() {
    this.states = [{id: 4, name: "Hola", tasks: []}, {id: 5, name: 'Adios', tasks: []}];
  }
}