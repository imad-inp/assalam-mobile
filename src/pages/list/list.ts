import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { ReminderProvider } from '../../providers/reminder/reminder';
import { Kafala } from "../../app/data-models/kafala";
import { Kafil } from "../../app/data-models/kafil";
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';
import { Platform } from 'ionic-angular';

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
  loading : any;

  kafalasPerKafil = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService : DataServiceProvider, private sms: SMS,
   private call: CallNumber, private platform: Platform, private reminderProvider : ReminderProvider, private toastCtrl: ToastController,
   public loadingCtrl: LoadingController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item'); 
    
    this.getUsers();
    
  }

 
  sendSMS(kafalasGroupedByKafil){  
      
      //  this.sendNativeSms(kafalasGroupedByKafil[0].kafil.tel, message);
       this.showLoader();
      var message = this.buildSms(kafalasGroupedByKafil);
     this.sendNativeSms(kafalasGroupedByKafil[0].kafil.tel, message, kafalasGroupedByKafil[0].kafil.id);
  }

  /*
  add description
  */
  buildSms(kafalas){
    return "Hello " + kafalas[0].kafil.nom + " " + kafalas[0].kafil.prenom + ".You have " + kafalas.length + " late kafalas to pay";
  }

  /*add description
  */
  sendNativeSms(tel, message, kafilId){

     var options={
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
               intent: ''  // Opens Default sms app
              //intent: '' // Sends sms without opening default sms app
            }
    }
    
    this.sms.send(tel, message,options)
      .then(()=>{
       this.presentToast("success");
        this.addReminder(kafilId);
      },()=>{
         this.loading.dismiss();
      this.presentToast("failed");
      });

  }

  /*add description
  */
  addReminder(kafilId){
    var date = new Date().toISOString().split('T')[0];
         this.reminderProvider.addReminder({
          'date' : date,
          'kafils': {
            'id' : kafilId
          }
        }).subscribe(resp => {
          alert("add reminder success");
           this.getUsers();
        });
  }


  /* add description
  */
   callNumber(kafalaGroupedByKafil){
    this.platform.ready().then(() => {
      console.log("platform ready");
      (<any>window).plugins.CallNumber. callNumber("07404131284", true)
  .then(() =>  alert("success"))
  .catch((error) => alert("error" + error));
     })
   
  }

  /*process kafalas to group them by kafil Id
  */
  groupKafalasPerKafil(kafalas){
    var tmpKafils = {};

       for (var kafala of this.kafalas) {
        if(tmpKafils[kafala.kafil.id]){
         tmpKafils[kafala.kafil.id].push(kafala);
       }
       else{
        tmpKafils[kafala.kafil.id] = [kafala];
        }
      }
   this.kafalasPerKafil = Object.keys(tmpKafils).map(key=>tmpKafils[key]);
  }

  getUsers() {
    this.dataService.list().subscribe(resp => {
     this.kafalas = resp;
     
     //group kafalas per kafil
     this.groupKafalasPerKafil(resp);
  
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

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: 'Sending SMS...'
    });

    this.loading.present();
  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      dismissOnPageChange: true
    });
   toast.present();
}
}
