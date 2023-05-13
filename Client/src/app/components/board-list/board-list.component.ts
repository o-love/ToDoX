import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Board } from 'src/app/models/board';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit {
  boards: Board[] = [];
  showAddPopup: boolean = false;

  constructor(public boardService: BoardService, private router: Router) { }

  ngOnInit(): void {
    this.getBoards();
  }

  private getBoards(): void {
    console.log('loading boards...');

    this.boardService.getBoards().subscribe({
      next: (boards: Board[]) => {
        this.boards = boards;
        console.log('boards retrieved:', boards);
      },
      error: (err: any) => console.error('error getting boards:', err)
    })
  }

  show() {
    return this.showAddPopup;
  }

  hidePopup() {
    if (this.showAddPopup) this.showAddPopup = false;
  }

  openAddPopup() {
    if (!this.showAddPopup) this.showAddPopup = true;
  }

  viewBoard(board_id: string) {
    this.router.navigate(['/boards', board_id]);
  }

  addBoard() {
    this.getBoards();
    this.hidePopup();
  }

  deleteBoard(board_id: string): void {
    console.log('deleting board...');

    this.boardService.deleteBoard(board_id).subscribe({
      next: () => {
        console.log('board deleted');
        this.getBoards()
      }
    });
  }
}