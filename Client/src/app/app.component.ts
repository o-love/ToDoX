import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ToDoX';
  showLoginButton: boolean = false;
  
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  onBoardCreated(board: any) {
    this.http.post('http:/localhost:8082/api/board', board).subscribe((response) => {
      console.log(response);
    });
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.showLoginButton = data['showLoginButton'] || false;
    });
  }
}
