import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Board } from 'src/app/models/board';
import { BoardService } from 'src/app/services/board-service/board-service.service';

// This component will be responsible for displaying the list of all available boards

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit {
  boards: Board[] = [];

  constructor(private boardService: BoardService, private router: Router) {}

  ngOnInit(): void {
    this.getBoards();
  }

  getBoards(): void {
    this.boardService.getBoards().subscribe(
      (boards: Board[]) => {
        console.log('Boards retrieved:', boards);
        this.boards = boards;
      },
      (error: any) => {
        console.error('Error retrieving boards:', error);
      }
    );
  }

  viewBoard(id: number) {
    this.router.navigate(['/boards', id]);
  }
}
