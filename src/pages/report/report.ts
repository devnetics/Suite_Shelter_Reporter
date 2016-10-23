import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Camera, Geolocation } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';



@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {

  search: {name?: string/*, password?: string*/} = {};
  showNew: boolean;
  report: {name?: string, description?: string, email?: string, phone?: string} = {};
  submitted = false;
  users: Array<any>; 
  sightings = [];
  location: {
    coords: {
      latitude: number,
      longitude: number
    }    
  } 
  storage: Storage;  

  constructor(
    public navCtrl: NavController,
    public http: Http        
  ) {
    this.showNew = false;    
    this.storage = new Storage();
    this.storage.get('sightings').then( (sightings) => {
      if (sightings) {
        this.sightings = sightings;
      }      
    }, (err) => {
      console.log(err);
    })
  }

  showNewFn() {
    this.showNew = !this.showNew;
  }

  searchUsers() {    
    this.http.get('http://localhost:8080/hl_users?name=' + this.search.name).subscribe(res => {                   
      this.users = res.json();          
      // for (let user of response.json()) {        
      //   if (user.profile) {        
      //     users.push(user.profile);
      //   }        
      // }
      // this.users = users;           
    });
  }

  fetchImage() {
    Camera.getPicture().then( (picture) => {
      console.log(picture);
      //return picture;
    }).catch( (err) => {
      console.log(err);
      //return err;
    })
  }

  sendReport(id: number, name: string, description?: string) {
    console.log(id);
    Geolocation.getCurrentPosition().then((resp) => {      
      let body = {
        user: {
          _id: id          
        },
        user_report: {
          description: description,
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude
        }            
      };
      this.http.post('http://localhost:8080/reports', body).subscribe(res => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference       
        console.log(res);
        this.sightings.push({
          user: {
            _id: id,
            profile: {
              name: name
            }          
          },
          user_report: {
            description: description,
            latitude: resp.coords.latitude,
            longitude: resp.coords.longitude
          }
        }
        );
        this.storage.set('sightings', this.sightings);        
      });
    }).catch( (err) => {  
      console.log(err);   
    });    
  }

  sendReportNewUser() {
    Geolocation.getCurrentPosition().then((resp) => {
      let body = {
        user: {
          name: this.report.name,
          email: this.report.email,
          phone: this.report.phone
        },
        user_report: {
          description: this.report.description,
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude
        }
      };
      this.http.post('http://localhost:8080/reports', body).subscribe(res => {
        console.log(this.report.name);
        console.log(res);
      });
    });
  }

}
