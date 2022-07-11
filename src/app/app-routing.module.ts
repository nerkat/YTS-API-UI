import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { MovieListComponent } from './movie-list/movie-list.component';

const routes: Routes = [
  { path: 'recent-releases', component: MovieListComponent },
  { path: 'most-downloaded', component: MovieListComponent },
  { path: 'search', component: MovieListComponent },
  { path: 'favorites', component: MovieListComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: 'recent-releases', pathMatch: 'full' },
  { path: '', redirectTo: 'recent-releases', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
