import { Component, EventEmitter, Output } from '@angular/core';
import { TaskService } from 'src/app/services/task-service/task-service.service';
import { Label } from 'src/app/models/label';

@Component({
  selector: 'app-create-label',
  templateUrl: './create-label.component.html',
  styleUrls: ['./create-label.component.scss']
})
export class CreateLabelComponent {
  @Output() createdLabel = new EventEmitter<any>();

  labelName: string = '';
  labelColor: string = '';
  labelDescription: string = '';
  labelType: string = '';

  constructor(private taskService: TaskService) {}

  onSubmit() {
    if (this.labelName) {
      this.taskService.createLabel(this.labelName, this.labelColor, this.labelDescription).subscribe({//, this.labelType).subscribe({
        next: (label: Label) => {
          this.createdLabel.emit(label);
          this.labelName = '';
          this.labelColor = '';
          this.labelDescription = '';
          // this.labelType = '';
        },
        error: (error) => console.log(error)
      });
      console.log("creating label", this.labelName, this.labelColor, this.labelDescription, this.labelType);
    }
  }
}
