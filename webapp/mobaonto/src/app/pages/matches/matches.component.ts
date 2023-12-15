import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GraphDbService } from 'src/app/services/graph-db.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {
  matches :Array<any> = [

    // more items...
  ];
  player_id : string= ""

  constructor(private service:GraphDbService, private route:ActivatedRoute ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.player_id = params.get('playerID')|| '';
      console.log(this.player_id);

      this.service.getMatches(this.player_id).subscribe((data) => {
        console.log(data);
        this.matches = data.results.bindings;
      });
    });


  }
  getIdFromUri(uri: string): string {
    return uri.substring(uri.lastIndexOf('#') + 1);
  }
  getMatchName(uri: string): string {
    uri = this.getIdFromUri(uri)
    return uri.replace('LOL_', '');
  }
  getPlayerName(): string {
    let uri = this.player_id
    return uri.replace('LOL_Agent_', '');
  }
}
