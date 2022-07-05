import { Component, OnInit } from '@angular/core';
import { YtsService } from '../yts.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(public ytsService: YtsService) { }

  ngOnInit(): void {
  }

}
