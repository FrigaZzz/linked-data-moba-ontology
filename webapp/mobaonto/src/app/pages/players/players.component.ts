import { Component, OnInit } from '@angular/core';
import { GraphDbService } from 'src/app/services/graph-db.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  players :Array<any> = [


    // more items...
  ];

  constructor(private service:GraphDbService) { }

  ngOnInit(): void {
    this.service.getPlayers().subscribe((data) => {
      console.log(data);
      this.players = data.results.bindings;
    });

  }
  getIdFromUri(uri: string): string {
    return uri.substring(uri.lastIndexOf('#') + 1);
  }
  getPlayerName(uri: string): string {
    uri = this.getIdFromUri(uri)
    return uri.replace('LOL_Agent_', '');
  }
}
