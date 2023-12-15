import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraphDbService } from 'src/app/services/graph-db.service';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.scss']
})
export class MatchDetailComponent implements OnInit {
  matchData: any;
  matchID: string = '';
  constructor(private service:GraphDbService, private route:ActivatedRoute ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.matchID =params.get('matchID')|| '';
      console.log(this.matchID);

      this.service.getMatch(this.matchID).subscribe((data) => {
        console.log(data);
        this.matchData = data.results.bindings;
      });
    });


  }
  getIdFromUri(uri: string): string {
    return uri.substring(uri.lastIndexOf('#') + 1);
  }
  getPlayerName(uri: string): string {
    uri = this.getIdFromUri(uri)
    return uri.replace('LOL_Agent_', '');
  }
  getMatchName(): string {
    let uri = this.matchID
    return uri.replace('LOL_', '');
  }
  getTeamName(uri: string): string {
    uri = this.getIdFromUri(uri)
    return uri.replace(this.matchID+"_", '');
  }
}
