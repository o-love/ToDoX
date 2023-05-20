import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  getAuthToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  private saveToken(token: any) {
    localStorage.setItem('token', token.split('|')[1]);
  }

  login(email: string, password: string): Observable<null> {
    const user = {
      email: email,
      password: password,
    };

    const toRet = this.http.post<any>(`${this.apiUrl}/login`, user);

    return toRet.pipe(map((res: any) => {
      this.saveToken(res.token);
      return res.user;
    }));
  }

  register(name: string, email: string, password: string): Observable<User> {
    const user = {
      name: name,
      email: email,
      password: password,
    };
    const toRet = this.http.post<any>(`${this.apiUrl}/users`, user);

    return toRet.pipe(map((response: any) => {
      this.saveToken(response.token);
      return response.user;
    }));
  }

  logout() {
    localStorage.removeItem('token');
  }

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users`)
      .pipe(map((data: any) => data.data));
  }

  getUserById(id: number): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/users/${id}`)
      .pipe(map((data: any) => data.data));
  }

  updateUser(user: User): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/users/${user.id}`, user)
      .pipe(map((data: any) => data.data));
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  getMyUser(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/myUser`)
      .pipe(map((data: any) => data.data));
  }

  updatePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<boolean> {
    // true if success, false if not
    return this.http
      .post(
        `${this.apiUrl}/myUser/updatepassword`,
        {
          newpassword: newPassword,
          oldpassword: oldPassword,
        },
        { observe: 'response' }
      )
      .pipe(
        map((res: any) => {
          console.log(res);
          return res.status === 200;
        }),
        catchError(() => of(false))
      );
  }
}
