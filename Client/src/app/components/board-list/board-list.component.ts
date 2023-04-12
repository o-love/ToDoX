import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Board } from 'src/app/models/board';
import { BoardService } from 'src/app/services/board-taskList-service/board-taskList-service.service';

// This component will be responsible for displaying the list of all available boards

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit {
  constructor(private boardService: BoardService, private router: Router) { }

  boards: Board[] = [
    { id: 1, name: 'Hola', description: 'holaquetal', isEditing: false },
    { id: 2, name: 'Adiós', description: 'mecaesmal', isEditing: false },
    { id: 3, name: 'Cachis', description: 'mequieromorir', isEditing: false },
    { id: 4, name: 'Vaya mierda', description: 'aaaaa', isEditing: false },
    { id: 5, name: 'Suicidio', description: 'pucha', isEditing: false },
    { id: 6, name: 'Homicidio', description: 'pucha', isEditing: false }
  ];
  showPopup = false;

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
    this.router.navigate(['/boards', id]); //name + '-' +
    // When accessing by url, id is not received - REV.
    // this.router.navigateByUrl(`/boards/${name}`, { state: { boardId: id } });
  }

  addBoard(newBoard: Board) {
    this.boards.push(newBoard);
    this.showPopup = false;
    this.getBoards();
  }

  deleteBoard(id: number): void {
    console.log("Board id delete", id);
    this.boardService.deleteBoard(id).subscribe(() => {
      this.getBoards();
    });
    console.log("Deleted board", id);
  }

  editBoard(id: number): void {
    console.log("Board id edit", id);
    this.boards[id].isEditing = true;
  }

  saveBoardEdit(index: number): void {
    const board = this.boards[index];
    this.boardService.editBoard(board.id, board.name, board.description).subscribe(
      (response) => {
        console.log("Board updated:", response);
        board.isEditing = false;
        this.getBoards();
      },
      (error) => {
        console.error("Error updating board:", error);
      }
    );
  }
  
  cancelBoardEdit(index: number): void {
    this.boards[index].isEditing = false;
  }
}
