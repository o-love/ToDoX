import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task-service/task-service.service';
import { Label } from 'src/app/models/label';

@Component({
  selector: 'app-label-detail',
  templateUrl: './label-detail.component.html',
  styleUrls: ['./label-detail.component.scss']
})
export class LabelDetailComponent implements OnInit {
  labels: Label[]  =[];

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.getLabels();
  }

  getLabels(): void {
    this.taskService.getLabels().subscribe(
      labels => {
        this.labels = labels;
        console.log("Retrieved labels", this.labels);
      }
    );
  }
}
