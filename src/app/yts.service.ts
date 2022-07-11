import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SettingsService } from './settings/settings.service';
import { NavigationStart, Router, Event as NavigationEvent } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(private sanitizer: DomSanitizer, public router: Router, private http: HttpClient, private settingsService: SettingsService) {
    this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationStart) {

            // save current url
            this.currentUrl = event.url;

            // recent releases data load
            if (event.url == '/recent-releases' || event.url == '/') {
              this.movies = [];
              this.page = 0;
              this.sortBy = "date_added";
              this.movieCount = -1;
              this.getMovies();
            }

            // most downloaded data load
            if (event.url == '/most-downloaded') {
              this.movies = [];
              this.page = 0;
              this.sortBy = "download_count";
              this.movieCount = -1;
              this.getMovies();
            }

            // favorites - load from storage data
            if (event.url == '/favorites') {
              this.movies = this.settingsService.settings.favMovies;
            }
          }
        });


    // register for body scroll - infinite scroll
    const body: any = document.querySelector('body');
    body.addEventListener('scroll', () => {
      if (body.offsetHeight + body.scrollTop >= (body.scrollHeight - 10)) {
        this.$getMovies.next(null);
      }
    })

    // get more movies with debounce
    this.$getMovies
      .pipe(debounceTime(300))
      .subscribe(() => {
        if (this.currentUrl == '/recent-releases' || this.currentUrl == '/most-downloaded') {
          this.page++;
          this.getMovies();
        }
      });

    // search movies with debounce
    this.$search
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.router.navigateByUrl('/search')
        this.movies = [];
        this.page = 0;
        this.movieCount = -1;
        this.getMovies();
      });
  }


  // get movies api call
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

      // save movie count
      this.movieCount = data.data.movie_count;

      // return if no data
      if (!data.data.movies) {
        this.loading = false;
        return;
      }

      this.movies = [...this.movies, ...this.formatMovies(data.data.movies)];
      this.loading = false;

    })
  }

  formatMovies(movies: any) {
    movies = this.removeDuplicates(movies);
    movies = this.removeOldTitles(movies);
    movies = this.sortByReleaseDate(movies);
    movies = this.formatMovieProperties(movies);
    return movies;
  }

  // remove duplicates by id
  removeDuplicates(originalArray: any) {
    var newArray = [];
    var lookupObject: any = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i]["id"]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  // remove titles prior to settings 'release-year' var
  removeOldTitles(movies: any) {
    var releaseYear = parseInt(this.settingsService.settings.hideYear) - 1;
    return movies.filter(function (movie: any) {
      return movie.year > releaseYear;
    });
  }

  // reorder by release date
  sortByReleaseDate(movies: any) {
    return movies.sort((a: any, b: any) => (a.date_uploaded_unix > b.date_uploaded_unix) ? -1 : 1);
  }

  formatMovieProperties(movies: any) {
    return movies.map(function (movie: any) {

      // construct magnet link 
      if (movie.torrents[1]) {
        movie.magnet = this.sanitizer.bypassSecurityTrustUrl('magnet:?xt=urn:btih:' + movie.torrents[1].hash + '&dn=' + movie.slug + '&tr=http://track.one:1234/announce&tr=udp://track.two:80');
      }
      else {
        movie.magnet = this.sanitizer.bypassSecurityTrustUrl('magnet:?xt=urn:btih:' + movie.torrents[0].hash + '&dn=' + movie.slug + '&tr=http://track.one:1234/announce&tr=udp://track.two:80');
      }

      // construct youtube link
      movie.ytLink = "https://www.youtube.com/watch?v=" + movie.yt_trailer_code;

      // construct IMDB link
      movie.imdbLink = "https://www.imdb.com/title/" + movie.imdb_code;

      // toggle fav boolean per movie - from storage data
      for (var i = 0; i < this.settingsService.settings.favMovies.length; i++) {
        if (this.settingsService.settings.favMovies[i].id == movie.id) {
          movie.fav = true;
          break;
        }
      }

      return movie;

    }, this)

  }
}
