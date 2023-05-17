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
    return this.getAuthToken() != null || this.cacheService.getCachedMyUser() != undefined;
  }

  async login(email: string, password: string): Promise<any> {
    const user = {
      email: email,
      password: password,
    };

    console.log('POST my user...');
    const http = this.http.post<any>(`${this.apiUrl}/login`, user);
    
    return await new Promise((resolve) =>
      http.subscribe({
        next: (user: any) => {
          localStorage.setItem('token', user.token.split('|')[1]);
          this.getMyUser().then((user: User) => {
            console.log('user logged in:', user);
            resolve(user);
          });
        },
        error: (err: any) => console.error('error logging user:', err)
      })
    );
  }

  async register(name: string, email: string, password: string): Promise<User> {
    const user = {
      name: name,
      email: email,
      password: password,
    };
    console.log('POST user...');
    const http = this.http.post<User>(`${this.apiUrl}/users`, user);

    return await new Promise((resolve) => 
      http.subscribe({
        next: (data: any) => {
          this.getMyUser().then((user: User) => {
            console.log('user signed up:', user);
            resolve(user);
          });
        },
        error: (err: any) => console.error('error signing up user:', err)
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.cacheService.deleteMyUser();
  }

  async getAllUsers(): Promise<User[]> {
    let users: any = this.cacheService.getCachedUsers();
    console.log('cached users:', users);
    if (users && users.length > 0) return new Promise((resolve) => resolve(users));

    console.log('GET users...');
    const http = this.http.get<User[]>(`${this.apiUrl}/users`);

    return await new Promise((resolve) =>
      http.subscribe({
        next: (data: any) => {
          this.cacheService.storeUsers(data.data);
          console.log('users retrieved:', data.data);
          resolve(data.data);
        },
        error: (err: any) => console.error('error getting all users:', err)
      })
    )
  }

  async getUserById(id: number): Promise<User> {
    let user: any = this.cacheService.getCachedUserById(id);
    console.log('cached user:', user);
    if (user) return new Promise((resolve) => resolve(user));

    console.log('GET user by id...');
    const http = this.http.get<User>(`${this.apiUrl}/users/${id}`);

    return await new Promise((resolve) =>
      http.subscribe({
        next: (data: any) => {
          this.cacheService.storeUser(data.data);
          console.log('user retrieved:', data.data);
          resolve(data.data);
        },
        error: (err: any) => console.error('error getting user by id:', err)
      })
    )
  }

  async updateUser(user: User): Promise<User> {
    console.log('PUT user...');
    const http = this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user)
    .pipe(map((data: any) => data.data));
    
    return await new Promise((resolve) => 
      http.subscribe({
        next: (user: User) => {
          this.cacheService.storeUser(user);
          console.log('user updated:', user);
          resolve(user);
        },
        error: (err: any) => console.error('error updating user:', err)
      })
    )
  }

  async deleteUser(id: number): Promise<any> {
    console.log('DELETE user...');
    const http = this.http.delete(`${this.apiUrl}/users/${id}`);

    return await new Promise((resolve) =>
      http.subscribe({
        next: () => {
          this.cacheService.deleteUser(id);
          console.log('user deleted');
          resolve(null);
        },
        error: (err: any) => console.error('error deleting user:', err)
      })
    )
  }

  async getMyUser(): Promise<User> {
    let user: any = this.cacheService.getCachedMyUser();
    console.log('cached my user:', user);
    if (user) return new Promise((resolve) => resolve(user));

    console.log('GET my user...');
    const http = this.http.get<User>(`${this.apiUrl}/myUser`);

    return await new Promise((resolve) => 
      http.subscribe({
        next: (data: any) => {
          this.cacheService.storeMyUser(data.data);
          console.log('user retrieved:', data.data);
          resolve(data.data);          
        },
        error: (err: any) => console.error('error getting my user:', err)
      })
    );
  }

  async updatePassword (
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> {
    // true if success, false if not
    console.log('PUT passsword');
    const http = this.http
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

      return await new Promise((resolve) => 
        http.subscribe({
          next: (value: boolean) => resolve(value),
          error: (err: any) => console.error('error updating password:', err)
        })
      );
  }
}