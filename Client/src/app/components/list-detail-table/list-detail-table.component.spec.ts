import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetailTableComponent } from './list-detail-table.component';

describe('ListDetailTableComponent', () => {
  let component: ListDetailTableComponent;
  let fixture: ComponentFixture<ListDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDetailTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
