import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphDbService {

  private BASE_URL = 'http://localhost:4200/';
  private REPOSITORY = 'repositories/MobaOntology';
  GAME = '${this.GAME}';
  prefixes = `
        PREFIX : <http://www.semanticweb.org/user/ontologies/2023/6/MobaOntology#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX col: <http://www.ontologydesignpatterns.org/cp/owl/collectionentity.owl#>
        PREFIX prov: <http://www.w3.org/ns/prov#>
        PREFIX BAG: <http://www.ontologydesignpatterns.org/cp/owl/bag.owl#>
        PREFIX LIST:<http://www.ontologydesignpatterns.org/cp/owl/list.owl#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  `
  constructor(private http: HttpClient) { }
  setGame(game: string) {
    this.GAME = `_GAME_${game}`;
  }
  executeQuery(query: string): Observable<any> {
    query = `${this.prefixes} \n ${query}`
    console.log(query)
    const headers = new HttpHeaders()
      .set('Accept', 'application/sparql-results+json,*/*;q=0.9')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = `query=${encodeURIComponent(query)}`;
    const url = `${this.BASE_URL}${this.REPOSITORY}`;

    return this.http.post<any>(url, body, { headers });
  }

  getQueryResultWithParams(player: string, match: string): Observable<any> {
    const query = `
      SELECT ?player ?match
      WHERE {
        ?player a :PlayerAgent .
        ?match a :Match .
        ?player :hasPlayedIn ?match .
      }
      VALUES ?player { "${player}" }
      VALUES ?match { "${match}" }
    `;

    return this.executeQuery(query);
  }

  getPlayers(): Observable<any> {
    const query = `
    SELECT ?player ?label ?description
    WHERE {
        ?player a :PlayerAgent.

        ?Game :has_game_player ?player.

        OPTIONAL { ?player rdfs:label ?label. }
        OPTIONAL { ?player rdfs:comment ?description. }
        VALUES ?Game {:${this.GAME}}
      }


    `;

    return this.executeQuery(query);
  }

  getMatches(player: string): Observable<any> {
    const query = `
      SELECT  ?match
      WHERE {
        # Fetching all player characters
        ?teamFormation a :TeamFormation ;
        prov:wasInfluencedBy ?match ;
        prov:qualifiedAssociation ?player .
      }
      VALUES ?player { :${player} }
    `;
    console.log(query)
    return this.executeQuery(query);
  }

  getMatch(match_id: string): Observable<any> {
    const query = `
    SELECT ?player ?team  ?playerEliminationCount   ?playerDeathCount ?totalGoldEarned ?npcEliminationCount{
        SELECT ?player ?team
        (COUNT(DISTINCT ?npcElimination) AS ?npcEliminationCount)
        (COUNT(DISTINCT ?playerElimination) AS ?playerEliminationCount)
        (COUNT(DISTINCT ?playerDeaths) AS ?playerDeathCount)
        (SUM(?npcGold) + SUM(?playerGold) AS ?totalGoldEarned)
        WHERE {
            # Fetching all player characters
            ?player a :PlayerAgent .
            ?teamFormation a :TeamFormation ;
            prov:generated ?team ;
            prov:qualifiedAssociation ?player .

            {
                # Counting all NPC character eliminations by each player and gold earned
                ?npcElimination a :NPCCharacterElimination ;
                :wasEliminatedBy ?player ;
                prov:wasInformedBy :${match_id}  ;
                prov:generated ?npcReward .
                ?npcReward :gold_amount ?npcGold .
            }
            UNION
            {
                # Counting all player character eliminations by each player and gold earned
                ?playerElimination a :PlayerCharacterElimination ;
                :wasEliminatedBy ?player ;
                prov:wasInformedBy :${match_id}  ;
                prov:generated ?playerReward .
                ?playerReward :gold_amount ?playerGold .
            }
            UNION
            {
                # Counting all player deaths
               ?playerDeaths a :PlayerCharacterElimination ;
                 prov:wasInformedBy :${match_id}  ;
                :hasEliminatedPlayerCharacter ?player .
            }
        }
        GROUP BY ?player ?team
    }
    `;
    console.log(query)
    return this.executeQuery(query);
  }


  getAbilities(player: string, match: string): Observable<any> {
    const query = `

    SELECT  ?step ?ability ?character
    WHERE {
      ?playerSession a :PlayerSession ;
         prov:wasInformedBy ?match ;
        prov:qualifiedAssociation ?player;
        :usedSkillSet ?skillset;
        prov:used ?inventory;
        prov:used ?character.
      ?inventory a :Inventory_Item_Sequence.
      ?character a :Game_Character.
      ?skillset a :SkillSet_Sequence.

      ?skillset col:hasMember ?step .
      ?step  :has_levelled_ability ?ability

      VALUES ?player { :${player} }
      VALUES ?match { :${match} }
    }


    `;
    console.log(query)
    return this.executeQuery(query);

  }

  getInventory(player: string, match: string): Observable<any> {
    const query = `

    SELECT  ?step ?item ?character
    WHERE {
      ?playerSession a :PlayerSession ;
         prov:wasInformedBy ?match ;
        prov:qualifiedAssociation ?player;
        :usedSkillSet ?skillset;
        prov:used ?inventory;
        prov:used ?character.
      ?inventory a :Inventory_Item_Sequence.
      ?character a :Game_Character.
      ?skillset a :SkillSet_Sequence.

      ?inventory :has_build_step ?step .
      ?step  :requires_item ?item

      VALUES ?player { :${player} }
      VALUES ?match { :${match} }
    }


    `;
    console.log(query)
    return this.executeQuery(query);

  }

  getCharacters() {
    const query = `
    SELECT ?character  ?label ?description

    WHERE {
        # Fetching all player characters
        ?character a :Game_Character ;
                   :character_belongs_to_moba_game ?Game
                   .

          OPTIONAL { ?character rdfs:label ?label. }
            OPTIONAL { ?character rdfs:comment ?description. }

        VALUES ?Game {:${this.GAME}}
    }

    `;

    return this.executeQuery(query);
  }
  getCharacter(character: string) {
    const query = `
    SELECT ?character  ?label ?description

    WHERE {
        # Fetching all player characters
        ?character a :Game_Character ;
                   :character_belongs_to_moba_game ?game
                   .

        OPTIONAL { ?character rdfs:label ?label. }
        OPTIONAL { ?character rdfs:comment ?description. }



        VALUES ?game {:${this.GAME}}
        VALUES ?character {:${character}}

    }


    `;

    return this.executeQuery(query);
  }
  getCharacterAbilities(character: any) {
    const query = `
    SELECT  ?character ?ability ?label ?description ?type
WHERE {

  ?character a :Game_Character.
  ?character :has_ability ?ability;
      :character_belongs_to_moba_game ?game
               .

    OPTIONAL { ?ability rdfs:label ?label. }
    OPTIONAL { ?ability rdfs:comment ?description. }
    ?ability :ability_type ?type


    VALUES ?game {:${this.GAME}}
    VALUES ?character {:${character}}

}

    `;

    return this.executeQuery(query);
  }

  getItems(): Observable<any> {
    const query = `
    SELECT  ?item ?label ?description
    WHERE {

      ?game a :Moba_game.
      ?game :has_item ?item;
                   .

        OPTIONAL { ?item rdfs:label ?label. }
        OPTIONAL { ?item rdfs:comment ?description. }


        VALUES ?game {:${this.GAME}}



}
    `;

    return this.executeQuery(query);

  }


  getItem(item:string): Observable<any> {
    const query = ` SELECT  ?item ?label ?description
    WHERE {

      ?game a :Moba_game.
      ?game :has_item ?item;
                   .

        OPTIONAL { ?item rdfs:label ?label. }
        OPTIONAL { ?item rdfs:comment ?description. }

        VALUES ?game {:${this.GAME}}
        VALUES ?item {:${item}}
`
    return this.executeQuery(query);
  }

}
