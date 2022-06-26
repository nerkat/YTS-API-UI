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
      this.ytsService.getMovies(0, 'date_added')
    });
  }

  ngOnInit(): void {

  }

}
