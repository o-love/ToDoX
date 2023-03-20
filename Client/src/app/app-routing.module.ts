import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBoardComponent } from './components/create-board/create_board.component';
import { BoardListComponent } from './components/board-list/board-list.component';

const routes: Routes = [
    { path: '', component: CreateBoardComponent },
    { path: 'boards', component: BoardListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
