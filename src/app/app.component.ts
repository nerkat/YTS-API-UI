import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {

  title = 'YTSS';
  movies: any = [];
  loading: boolean = true;
  query: string = "";
  sortBy: string = "date_added";
  releaseYear: number = 2000;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {

    this.getMovies(0);

  }

  getMovies(page: any) {
    this.http.get("https://yts.mx/api/v2/list_movies.json?quality=1080p&minimum_rating=6&limit=50&sort_by=" + this.sortBy + "&page=" + page + "&query_term=" + this.query).subscribe((data: any) => {
      if (!data.data.movies) { return; }
      let moviesLoad = [...this.movies, ...data.data.movies];
      moviesLoad = this.removeDuplicates(moviesLoad, "id");
      moviesLoad = this.removeOldTitles(moviesLoad, this.releaseYear);
      moviesLoad = this.sortByReleaseDate(moviesLoad);

      console.log(this.movies);

      if (page < 3 && data.data.movie_count > moviesLoad) {
        this.getMovies(page + 1);
      }

      else {
        this.movies = moviesLoad;
        this.loading = false;
      }

    })
  }

  getMagnet(movie: any) {

    if (movie.torrents[1]) {
      return this.sanitizer.bypassSecurityTrustUrl('magnet:?xt=urn:btih:' + movie.torrents[1].hash + '&dn=' + movie.slug + '&tr=http://track.one:1234/announce&tr=udp://track.two:80');
    }
    else {
      return this.sanitizer.bypassSecurityTrustUrl('magnet:?xt=urn:btih:' + movie.torrents[0].hash + '&dn=' + movie.slug + '&tr=http://track.one:1234/announce&tr=udp://track.two:80');
    }
  }

  getDate(movie: any) {
    return new Date(movie.date_uploaded_unix * 1000);
  }

  getYoutube(movie: any) {
    return "https://www.youtube.com/watch?v=" + movie.yt_trailer_code;
  }

  getImdb(movie: any) {
    return "https://www.imdb.com/title/" + movie.imdb_code;
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

