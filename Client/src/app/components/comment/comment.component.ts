import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { TaskCommentService } from 'src/app/services/task-comment/task-comment.service';
import { TaskComment } from 'src/app/models/taskComment';
import { UserAuthService } from 'src/app/services/user-auth/user-auth.service';
import { Task } from 'src/app/models/task';
import { User } from 'src/app/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  form: FormGroup;

  @Input() boardId: string | null = null;
  @Input() taskListId: string | null = null;
  @Input() task: Task | null = null;
  @Input() usersId: {[key: number]: User} = {}
  @Input() user: User | null = null;

  comments: TaskComment[] = [];

  timeout: any;
  disable: boolean = true;

  @ViewChild('send') send!: ElementRef<any>;

  constructor(private fb: FormBuilder, private taskCommentService: TaskCommentService, private taskService: TaskService, private userService: UserAuthService) {
    this.form = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(40)]]
    })
  }

  ngOnInit(): void {
    // this.getAllUsers();
    // this.getMyUser();
    this.getComments();
  }

  checkErrors(): boolean {
    if (this.form.controls['text'].errors)  {
      console.log(this.form.controls['text'].errors);
      return true;
    }

    return false;
  }

  onKeyUp() {
    console.log('typing...');
    clearTimeout(this.timeout);
    let $this = this;
    this.timeout = setTimeout(function() {
      $this.disable = $this.checkErrors();
      console.log($this.disable);
    }, 1000);
  }

  sendMessage() {
    if (this.disable) return;
    console.log('sending comment...');
    let message: string = this.form.value.text;
    this.form.controls['text'].disable();
    this.addComment(message);
  }

  isFromMyUser(user_id: number): boolean {
    if (this.user && user_id == this.user.id) return true;
    return false;
  }

  private getComments() {
    if (!this.boardId || !this.taskListId || !this.task) return;
    this.taskCommentService.getTaskComments(parseInt(this.boardId), parseInt(this.taskListId), this.task.id).then(
      (comments: TaskComment[]) => this.comments = comments
    );
  }

  addComment(message: string) {
    if (!this.boardId || !this.taskListId || !this.task || !this.user) return;
    this.taskCommentService.addTaskComment(parseInt(this.boardId), parseInt(this.taskListId), this.user.id, this.task.id, message,).then(
      (comment: TaskComment) => {
        this.comments.push(comment);
        this.form.controls['text'].setValue('');
        this.form.controls['text'].enable();
      }
    )
  }

  // editComment(comment: TaskComment, message: string) {
  //   comment.content = message;
  //   this.taskCommentService.updateTaskComment(comment.id, comment.content).subscribe({
  //     next: (comment: TaskComment) => {
  //       this.comments[this.comments.indexOf(comment)] = comment;
  //       console.log('saved comment edit:', comment);
  //     },
  //     error: (error: any) => console.error('error editing comment:', error)
  //   })
  // }

  // deleteComment(comment: TaskComment) {
  //   this.taskCommentService.deleteTaskComment(comment.id).subscribe({
  //     next: () => {
  //       this.comments.splice(this.comments.indexOf(comment), 1);
  //       console.log('deleted comment:', comment);
  //     },
  //     error: (error: any) => console.error('error deleting comment:', error)
  //   })
  // }  
}