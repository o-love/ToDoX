import { Component, EventEmitter, Output } from '@angular/core';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';
import { TaskList } from 'src/app/models/taskList';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-label',
  templateUrl: './create-label.component.html',
  styleUrls: ['./create-label.component.scss']
})

export class CreateLabelComponent {
  constructor(private boardService: BoardService, private route: ActivatedRoute, private router: Router) {}

  labelName: string = '';
  labelColor: string = '';
  labelId = this.route.snapshot.paramMap.get('id') || '';
  
  @Output() labelCreated = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<void>();

  onSubmit() {
    /*if (this.labelId && this.labelName) {
      this.boardService.createList(this.labelId, this.labelName, this.labelColor).subscribe({
        next: (list: TaskList) => {
          this.labelCreated.emit(list);
          this.labelName = '';
          this.labelColor = '';
        },
        error: (error) => console.log(error)
      });
    }*/
  }

  onClose() {
    this.closePopup.emit();
  }
}

