import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let  apiUrl = 'http://108.61.198.165/api/';
@Injectable()
export class AuthService {
 

  constructor(public http: HttpClient) {
    console.log('Hello AuthServiceProvider Provider');
  }

  authenticate(credentials){
   return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        
        this.http.post(apiUrl+'authenticate', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

}
