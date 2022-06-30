import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadedComponent } from './downloaded/downloaded.component';
import { RecentComponent } from './recent/recent.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: 'recent-releases', component: RecentComponent },
  { path: 'most-downloaded', component: DownloadedComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '/recent-releases', pathMatch: 'full' },
  { path: '', redirectTo: '/recent-releases', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
