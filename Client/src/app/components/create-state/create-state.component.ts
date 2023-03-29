import { Component, EventEmitter, Output } from '@angular/core';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';
import { TaskList } from 'src/app/models/taskList';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-state',
  templateUrl: './create-state.component.html',
  styleUrls: ['./create-state.component.scss']
})
export class CreateStateComponent {
  constructor(private boardService: BoardService, private route: ActivatedRoute, private router: Router) {}

  stateName: string = '';
  stateId = this.route.snapshot.paramMap.get('id') || '';
  
  @Output() stateCreated = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<void>();

  onSubmit() {
    if (this.stateId && this.stateName) {
      this.boardService.createBoard(this.stateId, this.stateName).subscribe({
        next: (state: TaskList) => {
          this.stateCreated.emit(state);
          this.stateName = '';
          this.stateId = '';
        },
        error: (error) => console.log(error)
      });
    }
  }

  onClose() {
    this.closePopup.emit();
  }
}


