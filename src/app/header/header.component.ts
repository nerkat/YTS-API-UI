import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Event as NavigationEvent } from '@angular/router';
import { SettingsService } from '../settings/settings.service';
import { YtsService } from '../yts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  pageTitle: string = "Recent Releases";
  showSearch: boolean = false;

  constructor(public router: Router, public ytsService: YtsService, public settingsService: SettingsService) {
    this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationStart) {
            
            //extract page title form route
            this.pageTitle = event.url.replace(/-/g, " ").slice(1);
          }
        });
  }

  ngOnInit(): void {

  }
}

