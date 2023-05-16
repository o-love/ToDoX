import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getAuthToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  login(email: string, password: string): Observable<null> {
    const user = {
      email: email,
      password: password,
    };

    console.log('POST my user...');
    const http = this.http.post<any>(`${this.apiUrl}/login`, user);
    
    http.subscribe({
      next: (user: any) => {
        localStorage.setItem('token', user.token.split('|')[1]);
        this.cacheService.storeMyUser(user);
      },
      error: (err: any) => console.error('error logging user:', err)
    });

    return http;
  }

  register(name: string, email: string, password: string): Observable<User> {
    const user = {
      name: name,
      email: email,
      password: password,
    };
    console.log('POST user...');
    const http = this.http.post<User>(`${this.apiUrl}/users`, user);

    http.subscribe({
      next: (user: any) => this.cacheService.storeMyUser(user),
      error: (err: any) => console.error('error signing up user:', err)
    })

    return http;
  }

  logout() {
    localStorage.removeItem('token');
    this.cacheService.deleteMyUser();
  }

  getAllUsers(): Observable<User[]> {
    let users: any = this.cacheService.getCachedUsers();
    console.log('cached users:', users);
    if (users && users.length > 0) return of(users);

    console.log('GET users...');
    const http = this.http.get<User[]>(`${this.apiUrl}/users`);

    http.subscribe({
      next: (users: User[]) => this.cacheService.storeUsers(users),
      error: (err: any) => console.error('error getting all users:', err)
    })

    return http;
  }

  getUserById(id: number): Observable<User> {
    let user: any = this.cacheService.getCachedUserById(id);
    console.log('cached user:', user);
    if (user) return of(user);

    console.log('GET user by id...');
    const http = this.http.get<User>(`${this.apiUrl}/users/${id}`);

    http.subscribe({
      next: (user: User) => this.cacheService.storeUser(user),
      error: (err: any) => console.error('error getting user by id:', err)
    })

    // return this.http
    //   .get<User>(`${this.apiUrl}/users/${id}`)
    //   .pipe(map((data: any) => data.data));
    return http;
  }

  updateUser(user: User): Observable<User> {
    console.log('PUT user...');
    const http = this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user)
    
    http.subscribe({
      next: (user: User) => this.cacheService.storeUser(user),
      error: (err: any) => console.error('error updating user:', err)
    })

    return http;
    // .pipe(map((data: any) => data.data));
  }

  deleteUser(id: number): Observable<any> {
    console.log('DELETE user...');
    const http = this.http.delete(`${this.apiUrl}/users/${id}`);

    http.subscribe({
      next: () => this.cacheService.deleteUser(id),
      error: (err: any) => console.error('error deleting user:', err)
    })

    return http;
  }

  getMyUser(): Observable<User> {
    let user: any = this.cacheService.getCachedMyUser();
    console.log('cached my user:', user);
    if (user) return of(user);

    console.log('GET my user...');
    const http = this.http.get<User>(`${this.apiUrl}/myUser`);

    http.subscribe({
      next: (user: User) => this.cacheService.storeMyUser(user),
      error: (err: any) => console.error('error getting my user:', err)
    })

    return http;
    // return this.http
    //   .get<User>(`${this.apiUrl}/myUser`)
    //   .pipe(map((data: any) => data.data));
  }

  updatePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<boolean> {
    // true if success, false if not
    console.log('PUT passsword');
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