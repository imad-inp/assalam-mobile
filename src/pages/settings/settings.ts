import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  apiAddress : string = "108.61.198.165"

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  saveApiAddress(){
     localStorage.setItem('apiAddress', "http://" + this.apiAddress + "/api");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}
