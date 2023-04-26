import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { ProfileComponent } from './components/profile/profile.component';

import { BoardDetailComponent } from './components/board-detail/board-detail.component';
import { ListDetailComponent } from './components/list-detail/list-detail.component';

// PROV until frontend decides
import { CreateLabelComponent } from './components/create-label/create-label.component';
import { LabelDetailComponent } from './components/label-detail/label-detail.component';
import { ListDetailKanbanComponent } from './components/list-detail-kanban/list-detail-kanban.component';
import { HomeComponent } from './components/home/home.component';
import { StateListComponent } from './components/state-list/state-list.component';
import { BoardListComponent } from './components/board-list/board-list.component';

const routes: Routes = [
  /*
  If a user types in the page URL without adding anything after the domain, the content of the welcome component will be loaded,
  and if they type in "/home" after the domain, it will also load the content of the welcome component.
  */
  { path: '', component: HomeComponent },  

  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: SignupFormComponent },
  { path: 'profile', component: ProfileComponent },

  { path: 'boards/:boardId', component: BoardDetailComponent, children: [
    { path: 'lists/:listId', component: ListDetailComponent }
  ]},

  // PROV until frontend decides
  { path: 'labels', component: LabelDetailComponent},
  { path: 'labels/new', component: CreateLabelComponent },
  { path: 'list-kanban', component: ListDetailKanbanComponent },
  { path: 'state', component: StateListComponent },
  { path: 'boards', component: BoardListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
