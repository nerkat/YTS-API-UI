import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SettingsService } from './settings/settings.service';

@Injectable({
  providedIn: 'root'
})

export class YtsService {

  page: number = 0;
  movies: any = [];
  sortBy: string = "date_added";
  query: string = "";
  movieCount: number;
  loading: boolean = false;

  constructor(private http: HttpClient, private settingsService: SettingsService) {
   
  }


  getMovies() {
    let quality = '';
    if (this.settingsService.settings.hide720) {
      quality = '1080p';
    }
    if (this.movieCount == this.movies.length) {
      this.loading = false;
      return;
    }
    this.loading = true;
    this.http.get("https://yts.mx/api/v2/list_movies.json?quality=" + quality + "&minimum_rating=" + this.settingsService.settings.hideRating + "&limit=50&sort_by=" + this.sortBy + "&page=" + this.page + "&query_term=" + this.query).subscribe((data: any) => {
      this.movieCount = data.data.movie_count;
      if (!data.data.movies) {
        this.loading = false;
        return;
      }
      let moviesLoad = [...this.movies, ...data.data.movies];
      moviesLoad = this.removeDuplicates(moviesLoad, "id");
      moviesLoad = this.removeOldTitles(moviesLoad, parseInt(this.settingsService.settings.hideYear) - 1);
      moviesLoad = this.sortByReleaseDate(moviesLoad);

      this.movies = moviesLoad;
      this.loading = false;

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
