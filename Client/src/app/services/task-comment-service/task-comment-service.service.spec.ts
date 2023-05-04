import { TestBed } from '@angular/core/testing';

import { TaskCommentServiceService } from './task-comment-service.service';

describe('TaskCommentServiceService', () => {
  let service: TaskCommentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskCommentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
