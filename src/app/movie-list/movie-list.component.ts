import { Component, OnInit } from '@angular/core';
import { YtsService } from '../yts.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

  constructor(public ytsService: YtsService) {

  }

  ngOnInit(): void {
  }

}
