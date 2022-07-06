import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { YtsService } from '../yts.service';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.scss']
})

export class RecentComponent implements OnInit {

  subject: Subject<any> = new Subject();

  constructor(public ytsService: YtsService, route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.ytsService.movies = [];
      this.ytsService.page = 0;
      this.ytsService.sortBy = "date_added";
      this.ytsService.movieCount = -1;
      this.ytsService.getMovies();
    });

    const body: any = document.querySelector('body');

    body.addEventListener('scroll', () => {
      if (body.offsetHeight + body.scrollTop >= (body.scrollHeight - 10)) {
        this.subject.next(null);
      }
    })

    this.subject
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.ytsService.page++;
        this.ytsService.getMovies();
      });
  }

  ngOnInit(): void {

  }

}
