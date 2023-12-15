import { Component, OnInit } from '@angular/core';
import { GraphDbService } from 'src/app/services/graph-db.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  items :Array<any> = [


    // more items...
  ];

  constructor(private service:GraphDbService) { }

  ngOnInit(): void {
    this.service.getItems().subscribe((data) => {
      console.log(data);
      this.items = data.results.bindings;
    });

  }
  getIdFromUri(uri: string): string {
    return uri.substring(uri.lastIndexOf('#') + 1);
  }
  getCharacterName(uri: string): string {
    uri = this.getIdFromUri(uri)
    return uri.replace('LOL_Character_', '');
  }
  getItemName(uri: string): string {
    uri = this.getIdFromUri(uri)
    return uri.split('_').slice(2).join(' ');
  }
}
