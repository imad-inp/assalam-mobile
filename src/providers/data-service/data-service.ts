import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Kafala } from "../../app/data-models/kafala";

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let  apiUrl =   localStorage.getItem('apiAddress') ? localStorage.getItem('apiAddress') :'http://admin.assalamsettat.com/api/';
//let  apiUrl = 'http://localhost:8080/api/';

@Injectable()
export class DataServiceProvider {
  token  : String;

  constructor(public http: HttpClient) {
    console.log('Hello DataServiceProvider Provider');
  }

  public list(): Observable<Array<Kafala>> {
    this.token = localStorage.getItem('token');
     let headers = new HttpHeaders();
     headers = headers.set('Content-Type', 'application/json')
     .set('Authorization', 'Bearer ' + this.token);
    return this.http.get<Array<Kafala>>(apiUrl + 'kafalas/late', {headers: headers});
  }

  getUsers() {
  return new Promise(resolve => {
    this.http.get(apiUrl+'kafalas/late').subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
}
}
