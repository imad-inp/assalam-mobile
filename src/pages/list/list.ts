import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Kafala } from "../../app/data-models/kafala";
import { Kafil } from "../../app/data-models/kafil";

let  apiUrl = 'http://localhost:8080/api/';
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  kafalas: Kafala[];
  itemExpandHeight: number = 110;

  kafalasPerKafil = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService : DataServiceProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item'); 
    
    this.getUsers();
    
  }

  getUsers() {
    this.dataService.list().subscribe(resp => {
     this.kafalas = resp;
     var tmpKafils = {};
    //process kafalas to group them by kafil Id
    for (var kafala of this.kafalas) {
      if(tmpKafils[kafala.kafil.id]){
       tmpKafils[kafala.kafil.id].push(kafala);
      }
      else{
        tmpKafils[kafala.kafil.id] = [kafala];
      }
}
  this.kafalasPerKafil = Object.keys(tmpKafils).map(key=>tmpKafils[key]);
  
  });
  }

  getUnpaidMonths(kafala : Kafala){
    let currentDate = new Date();
    let kafalaDate = new Date(kafala.startDate);
            var monthDifference = currentDate.getMonth() - kafalaDate.getMonth() + (12 * (currentDate.getFullYear() - kafalaDate.getFullYear())) + 1;
            return  Math.abs(monthDifference - kafala.moispayes);
  }
  expandItem(item){
   
        this.kafalasPerKafil.map((listItem) => {
 
            if(item == listItem){
                listItem.expanded = !listItem.expanded;
            } else {
                listItem.expanded = false;
            }
 
            return listItem;
 
        });
 
    }

  
}
