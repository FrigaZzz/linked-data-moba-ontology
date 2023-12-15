import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraphDbService } from 'src/app/services/graph-db.service';

@Component({
  selector: 'app-champion-detail',
  templateUrl: './champion-detail.component.html',
  styleUrls: ['./champion-detail.component.scss']
})
export class ChampionDetailComponent implements OnInit {
  characterDescription: string | undefined;
  abilities: any[] | undefined;
  characterID:string | undefined;
  constructor(private service:GraphDbService , private route:ActivatedRoute ) { }

  ngOnInit(): void {
      // Initialize the character description and abilities data here
      this.characterDescription = "Character description goes here";
      this.abilities = [
        // Abilities data goes here
      ];
    this.route.queryParamMap.subscribe((params) => {
      this.characterID =params.get('characterID')|| '';

      console.log(this.characterID);

      this.service.getCharacterAbilities(this.characterID).subscribe((data) => {
        console.log(data);
        this.abilities = data.results.bindings;
      });
      this.service.getCharacter(this.characterID).subscribe((data) => {
        console.log(data);
        this.characterDescription = data.results?.bindings[0]?.description?.value;
      });
    });

  }
  getCharacterName(): string {
    let uri = this.characterID || '';
    return uri.replace('LOL_Character_', '');
  }
}
