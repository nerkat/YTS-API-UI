import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YtsService } from '../yts.service';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.scss']
})
export class RecentComponent implements OnInit {

  constructor(public ytsService: YtsService, route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.ytsService.movies = [];
      this.ytsService.page = 0;
      this.ytsService.sortBy = "date_added";
      this.ytsService.movieCount = -1;
      this.ytsService.getMovies();
    });

    function debounce(func: any, timeout = 300) {
      let timer: any;
      return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      };
    }

    const processChange = debounce(() => this.ytsService.getMovies());

    const body: any = document.querySelector('body');

    body.addEventListener('scroll', () => {
      if (body.offsetHeight + body.scrollTop >= (body.scrollHeight - 10)) {
        this.ytsService.page++;
        processChange();
      }
    })
  }

  ngOnInit(): void {

  }

}
