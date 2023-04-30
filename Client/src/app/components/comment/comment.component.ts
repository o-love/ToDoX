import { Component } from '@angular/core';
import { TaskCommentService } from 'src/app/services/task-comment-service/task-comment-service.service';
import { TaskComment } from 'src/app/models/taskComment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {

  comments: TaskComment[] = [];

  constructor(private taskCommentService: TaskCommentService) { }

  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    this.taskCommentService.getTaskComments(1, 2, 3).subscribe(
      comments => {
        this.comments = comments;
      },
      error => {
        console.log(error);
      }
    );
  }

  addComment() {
    const comment = 'New comment';
    this.taskCommentService.addTaskComment(1, 2, 3, 4, comment).subscribe(
      comment => {
        this.comments.push(comment);
      },
      error => {
        console.log(error);
      }
    );
  }

  editComment(comment: TaskComment) {
    const newComment = prompt('Enter a new comment', comment.comment);
    if (newComment !== null) {
      this.taskCommentService.updateTaskComment(comment.id, newComment).subscribe(
        updatedComment => {
          const index = this.comments.findIndex(c => c.id === comment.id);
          this.comments[index] = updatedComment;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  deleteComment(comment: TaskComment) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.taskCommentService.deleteTaskComment(comment.id).subscribe(
        () => {
          const index = this.comments.findIndex(c => c.id === comment.id);
          this.comments.splice(index, 1);
        },
        error => {
          console.log(error);
        }
      );
    }
  }  
}
