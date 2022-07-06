import { Component } from '@angular/core';
import { SettingsService } from './settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {

  title = 'YTSS';


  constructor(public settingsService: SettingsService) {
  }

  ngOnInit() {

  }




}

