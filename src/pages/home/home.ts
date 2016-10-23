import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  sightings: Array<any>;
  storage: Storage;
  constructor(public navCtrl: NavController) {
    this.storage = new Storage();
    this.storage.get('sightings').then( (sightings) => {
      console.log(sightings);
      this.sightings = sightings;
    }, (err) => {
      console.log(err);
    })
  }

}
