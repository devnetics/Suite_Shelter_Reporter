import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Camera, Geolocation } from 'ionic-native';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {

  search: {name?: string/*, password?: string*/} = {};
  report: {name: string, description: string, email?: string, phone?: string}
  submitted = false;
  users: Array<any>; 
  location: {
    coords: {
      latitude: number,
      longitude: number
    }    
  } 

  constructor(
    public navCtrl: NavController,
    public http: Http    
  ) {
  }

  searchUsers() {    
    this.http.get('http://localhost:8080/hl_users?name=' + this.search.name).subscribe(res => {      
      let response: any = res;      
      let users = [];
      this.users = res.json();    
      console.log(this.users);  
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

  sendReport(id: number, description?: string) {
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
    });
    }).catch( (err) => {  
      console.log(err);   
    });    
  }

}
