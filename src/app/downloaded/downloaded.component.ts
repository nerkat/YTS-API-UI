import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YtsService } from '../yts.service';

@Component({
  selector: 'app-downloaded',
  templateUrl: './downloaded.component.html',
  styleUrls: ['./downloaded.component.scss']
})
export class DownloadedComponent implements OnInit {

  constructor(public ytsService: YtsService, route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.ytsService.movies = [];
      this.ytsService.getMovies(0, 'download_count')
    });
  }

  ngOnInit(): void {

  }


}
