import { Component, OnInit } from '@angular/core';
import { GraphDbService } from 'src/app/services/graph-db.service';

@Component({
  selector: 'app-champions',
  templateUrl: './champions.component.html',
  styleUrls: ['./champions.component.scss']
})
export class ChampionsComponent implements OnInit {
  characters :Array<any> = [


    // more items...
  ];

  constructor(private service:GraphDbService) { }

  ngOnInit(): void {
    this.service.getCharacters().subscribe((data) => {
      console.log(data);
      this.characters = data.results.bindings;
    });

  }
  getIdFromUri(uri: string): string {
    return uri.substring(uri.lastIndexOf('#') + 1);
  }
  getPlayerName(uri: string): string {
    uri = this.getIdFromUri(uri)
    return uri.replace('LOL_Agent_', '');
  }
  getCharacterName(uri: string): string {
    uri = this.getIdFromUri(uri)
    return uri.replace('LOL_Character_', '');
  }
}
