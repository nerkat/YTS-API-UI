import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  constructor(public settingsService: SettingsService) { }

  ngOnInit(): void {
  }

}
