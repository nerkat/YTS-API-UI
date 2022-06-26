import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class YtsService {

  movies: any = [];
  releaseYear: number = 2000;

  constructor(private http: HttpClient) { }

  getMovies(page: number = 0, sortBy: string = "date_added", query: string = "") {
    this.http.get("https://yts.mx/api/v2/list_movies.json?quality=1080p&minimum_rating=6&limit=50&sort_by=" + sortBy + "&page=" + page + "&query_term=" + query).subscribe((data: any) => {
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
