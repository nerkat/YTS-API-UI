import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { YtsService } from '../yts.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

export class MovieCardComponent implements OnInit {

  @Input() movie: any;

  constructor(private settingsService: SettingsService, private ytsService: YtsService) {

  }

  ngOnInit(): void {

  }

  // set fallback image
  replaceImage(event: any) {
    this.movie.noPoster = true;
    event.srcElement.src = 'assets/images/noImage.jpg';
  }

  // toggle movie fav prop
  favMovie(id: any) {
    if (this.movie.fav) {
      this.settingsService.settings.favMovies.push(this.movie);
    }
    else {
      this.ytsService.movies = this.settingsService.settings.favMovies.filter(function (movie: any) {
        return movie.id !== id;
      });
    }
    this.settingsService.save();
  }

}
