import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMoveCopyComponent } from './task-move-copy.component';

describe('TaskMoveCopyComponent', () => {
  let component: TaskMoveCopyComponent;
  let fixture: ComponentFixture<TaskMoveCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskMoveCopyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskMoveCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
