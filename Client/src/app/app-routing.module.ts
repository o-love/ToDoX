import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { HomeComponent } from './components/home/home.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { BoardListComponent } from './components/board-list/board-list.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { ProfileComponent } from './components/profile/profile.component';

import { BoardDetailComponent } from './components/board-detail/board-detail.component';
import { ListDetailComponent } from './components/list-detail/list-detail.component';

const routes: Routes = [
  /*
  If a user types in the page URL without adding anything after the domain, the content of the welcome component will be loaded,
  and if they type in "/home" after the domain, it will also load the content of the welcome component.
  */
  { path: '', component: WelcomeComponent },  

  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: SignupFormComponent },
  { path: 'profile', component: ProfileComponent },

  { path: 'boards', component: BoardListComponent },
  { path: 'boards/:boardId', component: BoardDetailComponent, children: [
    { path: 'lists/:listId', component: ListDetailComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }