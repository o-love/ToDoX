import { Component, Input } from '@angular/core';
import { State } from '@popperjs/core';
import { Label } from 'src/app/models/label';
import { Task } from 'src/app/models/task';
import { TaskList } from 'src/app/models/taskList';

@Component({
  selector: 'app-list-detail-table',
  templateUrl: './list-detail-table.component.html',
  styleUrls: ['./list-detail-table.component.scss']
})
export class ListDetailTableComponent {

  @Input() selectedList!: TaskList;
  @Input() tasks!: Task[];
  @Input() states!: State[];
  @Input() labels!: Label[];

}