import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  @Input() movie: any;

  constructor(private sanitizer: DomSanitizer, private settingsService: SettingsService) {

  }

  ngOnInit(): void {

    for (var i = 0; i < this.settingsService.settings.favMovies.length; i++) {
      if (this.settingsService.settings.favMovies[i].id == this.movie.id) {
        this.movie.fav = true;
        break;
      }
    }
  }

  getMagnet(movie: any) {

    if (movie.torrents[1]) {
      return this.sanitizer.bypassSecurityTrustUrl('magnet:?xt=urn:btih:' + movie.torrents[1].hash + '&dn=' + movie.slug + '&tr=http://track.one:1234/announce&tr=udp://track.two:80');
    }
    else {
      return this.sanitizer.bypassSecurityTrustUrl('magnet:?xt=urn:btih:' + movie.torrents[0].hash + '&dn=' + movie.slug + '&tr=http://track.one:1234/announce&tr=udp://track.two:80');
    }
  }

  getYoutube(movie: any) {
    return "https://www.youtube.com/watch?v=" + movie.yt_trailer_code;
  }

  getImdb(movie: any) {
    return "https://www.imdb.com/title/" + movie.imdb_code;
  }

  replaceImage(event: any) {
    this.movie.noPoster = true;
    event.srcElement.src = 'assets/images/noImage.jpg';
  }

  favMovie(id: any) {
    if (this.movie.fav) {
      this.settingsService.settings.favMovies.push(this.movie);
    }
    else {
      this.settingsService.settings.favMovies = this.settingsService.settings.favMovies.filter(function (movie: any) {
        return movie.id !== id;
      });
    }
    this.settingsService.save();
  }

}
