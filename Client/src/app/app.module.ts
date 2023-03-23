import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { BoardService } from './services/board-service/board-service.service';

import { CreateBoardComponent } from './components/create-board/create-board.component';
import { BoardListComponent } from './components/board-list/board-list.component';
import { CreateListComponent } from './components/create-list/create-list.component';
import { BoardDetailComponent } from './components/board-detail/board-detail.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginFormComponent } from './login-form/login-form.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateBoardComponent,
    BoardListComponent,
    BoardDetailComponent,
    CreateListComponent,
    HeaderComponent,
    LoginFormComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ // Ensuring that a single instance is created and shared across all components that inject it.
    BoardService, // So it is available throughout the application
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
