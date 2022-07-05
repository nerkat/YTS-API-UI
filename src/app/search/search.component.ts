import { Component, OnInit } from '@angular/core';
import { YtsService } from '../yts.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(public ytsService: YtsService) {

  }

  ngOnInit(): void {
  }

}
