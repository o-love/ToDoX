import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { ProfileComponent } from './components/profile/profile.component';

import { BoardListComponent } from './components/board-list/board-list.component';
import { BoardDetailComponent } from './components/board-detail/board-detail.component';
import { ListDetailComponent } from './components/list-detail/list-detail.component';

// PROV until frontend decides
import { CreateLabelComponent } from './components/create-label/create-label.component';
import { LabelDetailComponent } from './components/label-detail/label-detail.component';

const routes: Routes = [
  /*
  If a user types in the page URL without adding anything after the domain, the content of the welcome component will be loaded,
  and if they type in "/home" after the domain, it will also load the content of the welcome component.
  */
  { path: '', component: WelcomeComponent, data: { showLoginButton: true } },  
  { path: 'home', component: WelcomeComponent, data: { showLoginButton: true } },

  { path: 'login', component: LoginFormComponent, data: { showLoginButton: true } },
  { path: 'register', component: SignupFormComponent, data: { showLoginButton: true } },
  { path: 'profile', component: ProfileComponent, data: { showLoginButton: false } },

  { path: 'boards', component: BoardListComponent, data: { showLoginButton: false } },
  { path: 'boards/:boardId', component: BoardDetailComponent, data: { showLoginButton: false }, children: [
    { path: 'lists/:listId', component: ListDetailComponent, data: { showLoginButton: false } }
  ]},

  // PROV until frontend decides
  { path: 'labels', component: LabelDetailComponent, data: { showLoginButton: false } },
  { path: 'labels/new', component: CreateLabelComponent, data: { showLoginButton: false } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
