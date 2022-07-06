import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  years: any = [];

  constructor(public settingsService: SettingsService) { }

  ngOnInit(): void {

    // populate years
    let stopYear = 1900;
    var startYear = new Date().getFullYear();
    while (stopYear <= startYear) {
      this.years.push(startYear--);
    }
  }

}
