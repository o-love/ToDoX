import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserAuthServiceService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  getAuthToken() {
    return localStorage.getItem('token');
  }

  login(email: string, password: string) {
    const user = {
      email: email,
      password: password,
    };

    this.http.post<any>(`${this.apiUrl}/login`, user).subscribe((res: any) => {
      localStorage.setItem('token', res.token.split('|')[1]);
      console.log(this.getAuthToken());
    });
  }

  register(name: string, email: string, password: string): Observable<User> {
    const user = {
      name: name,
      email: email,
      password: password,
    };

    return this.http.post<User>(`${this.apiUrl}/user`, user);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user);
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/users/${id}`);
  }

  getMyUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/myUser`);
  }
}
