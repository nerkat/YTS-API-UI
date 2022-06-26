import { Component, OnInit } from '@angular/core';
import { YtsService } from '../yts.service';

@Component({
  selector: 'app-downloaded',
  templateUrl: './downloaded.component.html',
  styleUrls: ['./downloaded.component.scss']
})
export class DownloadedComponent implements OnInit {

  constructor(public ytsService: YtsService) { }

  ngOnInit(): void {

    this.ytsService.getMovies(0, 'download_count')
  }


}
