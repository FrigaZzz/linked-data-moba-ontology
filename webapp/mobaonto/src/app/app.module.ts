import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ItemsComponent } from './pages/items/items.component';
import { PlayersComponent } from './pages/players/players.component';
import { ChampionsComponent } from './pages/champions/champions.component';
import { HomeComponent } from './pages/home/home.component';
import { ItemDetailComponent } from './pages/item-detail/item-detail.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChampionDetailComponent } from './pages/champion-detail/champion-detail.component';
import { MatchesComponent } from './pages/matches/matches.component';
import { MatchDetailComponent } from './pages/match-detail/match-detail.component';
import { MatchStatisticsComponent } from './pages/match-statistics/match-statistics.component';
import { GraphDbService } from './services/graph-db.service';
import { HttpClientModule } from '@angular/common/http';


const routes: Routes = [
  {pathMatch: 'full', path: '', redirectTo: 'home'},
  // write the routes for champions, players
  {path: 'home', component: HomeComponent},
  {path: 'items', component: ItemsComponent},
  { path: 'item', component: ItemDetailComponent },
  {path: 'champions', component: ChampionsComponent},
  { path: 'champion', component: ChampionDetailComponent },
  {path: 'players', component: PlayersComponent},
  {path: 'matches', component: MatchesComponent},
  { path: 'match', component: MatchDetailComponent },
  { path: 'statistics', component: MatchStatisticsComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    PlayersComponent,
    ChampionsComponent,
    HomeComponent,
    ItemDetailComponent,
    ChampionDetailComponent,
    MatchesComponent,
    MatchDetailComponent,
    MatchStatisticsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [GraphDbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
