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

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    // this.http.get("https://yts.mx/api/v2/list_movies.json?quality=1080p?minimum_rating=6&limit=7").subscribe((data: any) => {
      this.http.get("https://yts.mx/api/v2/list_movies.json?quality=1080p?minimum_rating=6&limit=50&sort_by=date_added").subscribe((data: any) => {

      this.movies = data.data.movies;
      console.log(this.movies);

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
}
