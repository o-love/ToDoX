import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetailKanbanComponent } from './list-detail-kanban.component';

describe('ListDetailKanbanComponent', () => {
  let component: ListDetailKanbanComponent;
  let fixture: ComponentFixture<ListDetailKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDetailKanbanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDetailKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
