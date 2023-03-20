import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardListComponentComponent } from './board-list.component';

describe('BoardListComponentComponent', () => {
  let component: BoardListComponentComponent;
  let fixture: ComponentFixture<BoardListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardListComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
