import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {

  title = 'YTSS';
  movies: any = [];
  filterdMovies: any = [];
  loading: boolean = true;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {

    this.getMovies(0);

  }

  getMovies(page: any) {
    this.http.get("https://yts.mx/api/v2/list_movies.json?quality=1080p&minimum_rating=6&limit=50&sort_by=date_added&page=" + page).subscribe((data: any) => {
      this.movies = [...this.movies, ...data.data.movies];
      this.movies = this.removeDuplicates(this.movies, "id");
      this.movies.sort((a: any, b: any) => (a.year > b.year) ? -1 : 1)
      console.log(this.movies);

      if (page < 3) {
        this.getMovies(page + 1);
      }

      else {
        this.filterdMovies = this.movies;
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

  filterMovies(query: any) {
    if (!query || query == "") {
      this.filterdMovies = this.movies;
    }
    this.filterdMovies = this.movies.filter(function (movie: any) {
      return movie.title.toLowerCase().includes(query.toLowerCase());
    });

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
}
