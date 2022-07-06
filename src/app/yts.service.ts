import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SettingsService } from './settings/settings.service';
import { NavigationStart, Router, Event as NavigationEvent } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class YtsService {

  $getMovies: Subject<any> = new Subject();
  $search: Subject<any> = new Subject();

  page: number = 0;
  movies: any = [];
  sortBy: string = "date_added";
  query: string = "";
  movieCount: number;
  loading: boolean = false;
  currentUrl: string = "";

  constructor(public router: Router, private http: HttpClient, private settingsService: SettingsService) {
    this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationStart) {
            console.log(event);
            this.currentUrl = event.url;
            if (event.url == '/recent-releases') {
              this.movies = [];
              this.page = 0;
              this.sortBy = "date_added";
              this.movieCount = -1;
              this.getMovies();
            }
            if (event.url == '/most-downloaded') {
              this.movies = [];
              this.page = 0;
              this.sortBy = "download_count";
              this.movieCount = -1;
              this.getMovies();
            }
            if (event.url == '/favorites') {
              this.movies = this.settingsService.settings.favMovies;
            }
          }
        });


    const body: any = document.querySelector('body');

    body.addEventListener('scroll', () => {
      if (body.offsetHeight + body.scrollTop >= (body.scrollHeight - 10)) {
        this.$getMovies.next(null);
      }
    })

    this.$getMovies
      .pipe(debounceTime(300))
      .subscribe(() => {
        if (this.currentUrl == '/recent-releases' || this.currentUrl == '/most-downloaded') {
          this.page++;
          this.getMovies();
        }
      });

    this.$search
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.movies = [];
        this.page = 0;
        this.movieCount = -1;
        this.getMovies();
      });
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
