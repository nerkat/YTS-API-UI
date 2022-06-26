import { Component, OnInit } from '@angular/core';
import { YtsService } from '../yts.service';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.scss']
})
export class RecentComponent implements OnInit {

  constructor(public ytsService: YtsService) { }

  ngOnInit(): void {

    this.ytsService.getMovies(0, 'date_added')
  }

}
