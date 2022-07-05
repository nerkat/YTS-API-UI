import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SettingsService } from './settings/settings.service';

@Injectable({
  providedIn: 'root'
})

export class YtsService {

  movies: any = [];

  constructor(private http: HttpClient, private settingsService: SettingsService) { }

  getMovies(page: number = 0, sortBy: string = "date_added", query: string = "") {
    let quality = '';
    if (this.settingsService.settings.hide720) {
      quality = '1080p';
    }
    this.http.get("https://yts.mx/api/v2/list_movies.json?quality=" + quality + "&minimum_rating=" + this.settingsService.settings.hideRating + "&limit=50&sort_by=" + sortBy + "&page=" + page + "&query_term=" + query).subscribe((data: any) => {
      if (!data.data.movies) { return; }
      let moviesLoad = [...this.movies, ...data.data.movies];
      moviesLoad = this.removeDuplicates(moviesLoad, "id");
      moviesLoad = this.removeOldTitles(moviesLoad, parseInt(this.settingsService.settings.hideYear) - 1);
      moviesLoad = this.sortByReleaseDate(moviesLoad);

      if (page < parseInt(this.settingsService.settings.pagesToLoad) - 1 && data.data.movie_count > moviesLoad.length) {
        this.getMovies(page + 1, sortBy);
      }

      else {
        this.movies = moviesLoad;
      }

    })
  }

  removeDuplicates(originalArray: any, prop: any) {
    var newArray = [];
    var lookupObject: any = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  removeOldTitles(movies: any, releaseYear: number) {
    return movies.filter(function (movie: any) {
      return movie.year > releaseYear;
    });
  }

  sortByReleaseDate(movies: any) {
    return movies.sort((a: any, b: any) => (a.date_uploaded_unix > b.date_uploaded_unix) ? -1 : 1);
  }

}
