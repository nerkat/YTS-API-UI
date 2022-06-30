import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  settings: any = {
    hide720: true,
    darkTheme: false,
    hideRating: 5,
    hideYear: 2000,
    pagesToLoad: 6,
    favMovies: []
  };

  constructor() {
    if (localStorage.getItem('ytssSettings')) {
      this.settings = JSON.parse(localStorage.getItem('ytssSettings') || '{}');
    }
  }

  save() {
    localStorage.setItem('ytssSettings', JSON.stringify(this.settings));
  }
}
