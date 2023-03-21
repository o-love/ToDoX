import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardService } from 'src/app/services/board-service/board-service.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss']
})
export class CreateListComponent {
  constructor(private boardService: BoardService) {}

  // @Input() boardId: number;
  @Output() listCreated = new EventEmitter<any>();
  
  listName: string = '';
  listDescription: string = '';

  onSubmit() {
    console.log("list name: ", this.listName, " description: ", this.listDescription);
    // this.boardService.createList(this.boardId, this.listName, this.listDescription).subscribe({
    //   next: (list) => {
    //     this.listCreated.emit(list);
    //     this.listName = '';
    //     this.listDescription = '';
    //   },
    //   error: (error) => console.log(error)
    // });
  }

}
