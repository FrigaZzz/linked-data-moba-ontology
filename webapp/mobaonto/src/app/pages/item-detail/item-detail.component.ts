import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  item = { id: 1, name: 'Item 1', description: 'Item 1 description' };  // Mocked data

  constructor() { }

  ngOnInit(): void {
  }

}
