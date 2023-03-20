import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { CreateBoardComponent } from './components/create-board/create_board.component';
import { BoardListComponent } from './components/board-list/board-list.component';
import { CreateListComponent } from './components/create-list/create-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateBoardComponent,
    BoardListComponent,
    CreateListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
