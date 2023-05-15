import { Component, OnDestroy, OnInit } from '@angular/core';
import { CacheService } from './services/cache/cache.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ToDoX';
  
  constructor(private cacheService: CacheService) {}

  ngOnInit(): void {
    this.cacheService.deleteCache();
    this.cacheService.storeLastTime();
  }

  ngOnDestroy(): void {
    this.cacheService.storeLastTime();
  }
}