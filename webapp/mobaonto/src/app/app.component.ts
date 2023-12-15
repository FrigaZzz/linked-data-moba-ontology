import { Component } from '@angular/core';
import { GraphDbService } from './services/graph-db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mobaonto';
  currentSwitchValue= 'League_Of_Legends';
  constructor(private service:GraphDbService , private route:Router ){
    this.service.setGame(this.currentSwitchValue)
  }
  handleSwitch(value: string) {
  //   this.currentSwitchValue = value;
  //   // Esegui la logica desiderata in base al valore dello switch
  //   console.log('Switch value:', value);
  //   // Chiamare qui la funzione Angular desiderata
  //   // Esempio: this.myFunction(value);
  //   this.service.setGame(value)
  //   // Reload the current route
  // this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //   this.route.navigate([this.route.url]);
  // });

  // // Call any other desired Angular function here

  // this.service.setGame(value);
  this.currentSwitchValue = value;
  console.log('Switch value:', value);
  this.service.setGame(value);
  this.route.navigate(['']);
  }
}
