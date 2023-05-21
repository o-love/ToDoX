import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { BoardListComponent } from './components/board-list/board-list.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { ProfileComponent } from './components/profile/profile.component';

import { BoardDetailComponent } from './components/board-detail/board-detail.component';
import { LabelListComponent } from './components/label-list/label-list.component';
import { LabelDetailComponent } from './components/label-detail/label-detail.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },  

  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: SignupFormComponent },
  { path: 'profile', component: ProfileComponent },

  { path: 'boards', component: BoardListComponent },
  { path: 'boards/:boardId', component: BoardDetailComponent },
  { path: 'boards/:boardId/lists/:listId', component: BoardDetailComponent },

  { path: 'boards/:boardId/lists/:listId/label-list', component: LabelListComponent },
  { path: 'label-detail', component: LabelDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }