import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Injectable } from '@angular/core';

/*
  Generated class for the ReminderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let  apiUrl =   localStorage.getItem('apiAddress') ? localStorage.getItem('apiAddress') :'http://admin.assalamsettat.com/api/';

@Injectable()
export class ReminderProvider {
token  : String;

  constructor(public http: HttpClient) {
    
  }
 public addReminder(reminder): Observable<any> {
   console.log("hello reminder");
    this.token = localStorage.getItem('token');
     let headers = new HttpHeaders();
     headers = headers.set('Content-Type', 'application/json')
     .set('Authorization', 'Bearer ' + this.token);
    return this.http.post(apiUrl + 'reminders', reminder, {headers: headers}) ;
  }

}
