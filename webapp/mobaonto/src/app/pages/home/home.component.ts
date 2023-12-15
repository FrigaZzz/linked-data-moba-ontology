import { Component, OnInit } from '@angular/core';
import { GraphDbService } from 'src/app/services/graph-db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentSwitchValue =""
  constructor(private service:GraphDbService) {
    this.currentSwitchValue = this.service.GAME
   }

  ngOnInit(): void {
  }

}
