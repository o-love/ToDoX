import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { ProfileComponent } from './components/profile/profile.component';

import { CreateBoardComponent } from './components/create-board/create-board.component';
import { BoardListComponent } from './components/board-list/board-list.component';
import { BoardDetailComponent } from './components/board-detail/board-detail.component';

const routes: Routes = [
  /*
  If a user types in the page URL without adding anything after the domain, the content of the welcome component will be loaded,
  and if they type in "/home" after the domain, it will also load the content of the welcome component.
  */
  { path: '', component: WelcomeComponent },  
  { path: 'home', component: WelcomeComponent },

  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: SignupFormComponent },
  { path: 'boards', component: BoardListComponent },
  { path: 'boards/:id', component: BoardDetailComponent },
  { path: 'profile', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
