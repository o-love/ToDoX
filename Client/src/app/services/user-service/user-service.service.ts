import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // not final
  users: User[] = [
    { name: 'Sara', email: 'saragonza.lez0608@gmail.com', password: 'Hola!9' },
    { name: 'Pepe', email: 'pepe@gmail.com', password: 'Pepe!6' }
  ]

  user: User | null | undefined = null;

  createUser(name: string, email: string, password_token: string) {
    this.user = { name: name, email: email, password: password_token };
    this.users.push(this.user);
  }

  logUser(email: string, password_token: string): boolean {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email == email && this.users[i].password == password_token) {
        this.user = this.users[i];
        return true;
      }
    }
    return false;
  }
}
