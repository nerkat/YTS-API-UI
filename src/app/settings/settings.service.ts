import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  settings: any = {
    hide720: true,
    hideRating: 5,
    hideYear: 2000,
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
