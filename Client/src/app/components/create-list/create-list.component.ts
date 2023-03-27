import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';
import { TaskList } from 'src/app/models/taskList';
import { ActivatedRoute, Router } from '@angular/router';

// This component will be responsible for creating lists for a user on a board.

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss']
})
export class CreateListComponent {
  constructor(private boardService: BoardService, private route: ActivatedRoute, private router: Router) {}

  listName: string = '';
  listDescription: string = '';
  boardId = this.route.snapshot.paramMap.get('id') || '';
  
  @Output() listCreated = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<void>();

  onSubmit() {
    if (this.boardId && this.listName) {
      this.boardService.createList(this.boardId, this.listName, this.listDescription).subscribe({
        next: (list: TaskList) => {
          this.listCreated.emit(list);
          this.listName = '';
          this.listDescription = '';
        },
        error: (error) => console.log(error)
      });
    }
  }

  onClose() {
    this.closePopup.emit();
  }
}
