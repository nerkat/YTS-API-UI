import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Event as NavigationEvent } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { YtsService } from '../yts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  subject: Subject<any> = new Subject();

  pageTitle: string = "Recent Releases";
  showSearch: boolean = false;

  constructor(public router: Router, public ytsService: YtsService) {
    this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationStart) {
            this.pageTitle = event.url.replace(/-/g, " ").slice(1);
          }
        });
  }

  ngOnInit(): void {
    this.subject
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.ytsService.movies = [];
        this.ytsService.page = 0;
        this.ytsService.movieCount = -1;
        this.ytsService.getMovies();
      });
  }
}

