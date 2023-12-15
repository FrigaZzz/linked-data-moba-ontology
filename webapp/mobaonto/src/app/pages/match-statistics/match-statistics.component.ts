import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraphDbService } from 'src/app/services/graph-db.service';

@Component({
  selector: 'app-match-statistics',
  templateUrl: './match-statistics.component.html',
  styleUrls: ['./match-statistics.component.scss']
})
export class MatchStatisticsComponent implements OnInit {
  upgradedSkills: any= [];
  inventoryItems:any = []
  matchID: string = '';
  playerID: string = '';

  constructor(private service:GraphDbService, private route:ActivatedRoute ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.matchID =params.get('matchID')|| '';
      this.playerID =params.get('playerID')|| '';

      console.log(this.matchID);

      this.service.getAbilities(this.playerID,this.matchID).subscribe((data) => {
        console.log(data);
        this.upgradedSkills = data.results.bindings;
      });
      this.service.getInventory(this.playerID,this.matchID).subscribe((data) => {
        console.log(data);
        this.inventoryItems = data.results.bindings;
      });
    });


  }
  getIdFromUri(uri: string): string {
    return uri.substring(uri.lastIndexOf('#') + 1);
  }
  getPlayerName(): string {
    let uri =this.playerID
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
  getAbilityName(uri: string): string {
    uri = this.getIdFromUri(uri)
    const parts = uri.split('_');
    return parts[parts.length -1];
  }
  getUpgradeStepNumber(uri: string): string {
    uri = this.getIdFromUri(uri)
    return uri.split('_').slice(-1)[0];
  }
  getInventoryStepNumber(uri: string): string {
    uri = this.getIdFromUri(uri)
    return uri.split('_').slice(-1)[0];
  }
  getItemName(uri: string): string {
    uri = this.getIdFromUri(uri)
    return uri.split('_').slice(2).join(' ');
  }
  getCharacterName(uri: string): string {
    uri = this.getIdFromUri(uri)
    return uri.replace('LOL_Character_', '');
  }
}
