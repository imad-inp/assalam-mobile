import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController} from 'ionic-angular';
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
  currentDate : Date = new Date();
  kafilsWithoutReminders = 0;
  kafalasPerKafil = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService : DataServiceProvider, private sms: SMS,
   private call: CallNumber, private platform: Platform, private reminderProvider : ReminderProvider, private toastCtrl: ToastController,
   public loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item'); 
    
    this.getUsers();
    
  }

 sendSMSToAll(){
   this.presentAlert();
 }

 confirmSendSMSToAll(){
   for(let kafalas of this.kafalasPerKafil){
     if(this.getRemindersSent(kafalas[0].kafil.reminders) == 0 )
     this.sendSMS(kafalas);
   }
 }
  sendSMS(kafalasGroupedByKafil){
    if(!this.validateNumber(kafalasGroupedByKafil[0].kafil.tel) ) {
       this.presentToast("المرجو التاكد من رقم الهاتف");
    }
      
   else{
     this.showLoader();
      var message = this.buildSms(kafalasGroupedByKafil);
      console.log(message);
     this.sendNativeSms(kafalasGroupedByKafil[0].kafil.tel, message, kafalasGroupedByKafil[0].kafil.id);
   }
      
  }

  /*
  add description
  */
  buildSms(kafalas){
  return  "السلام عليكم سيد(ة) " +  kafalas[0].kafil.prenom + kafalas[0].kafil.nom + ".لديكم " + kafalas.length + " كفالات متاخرة الدفع، المرجو الاتصال بجمعية السلام لتسوية وضعيتكم. جزاكم الله خيرا.  ";
 
  }

   /*
  add description
  */
  validateNumber(tel){
    return tel != null && tel.match(/^0.*/) && tel.length == 10;
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
       this.presentToast("تم ارسال التذكير بنجاح");
        this.addReminder(kafilId);
      },()=>{
         this.loading.dismiss();
      this.presentToast("نعتذر، لم نتمكن من ارسال التذكير");
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
           this.getUsers();
        });
  }


  /* add description
  */
   callNumber(kafalaGroupedByKafil){
      if(!this.validateNumber(kafalaGroupedByKafil[0].kafil.tel) ) {
       this.presentToast("المرجو التاكد من رقم الهاتف");
    }
   else{
      
       var link = document.createElement("a");
       link.setAttribute("href", "tel:" +  kafalaGroupedByKafil[0].kafil.tel);
       link.click();
    }
    
   
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

     //calculate the number of kafils without reminder for the current month 
     this.calculateKafilsWithoutReminders();
  
  });
  }


  calculateKafilsWithoutReminders(){
    
    for(let kafalas of this.kafalasPerKafil){
        if(this. getRemindersSent(kafalas[0].kafil.reminders) == 0){
          this.kafilsWithoutReminders ++;
        }
    }
  }

  getUnpaidMonths(kafala : Kafala){
    let currentDate = new Date();
    let kafalaDate = new Date(kafala.startDate);
            var monthDifference = currentDate.getMonth() - kafalaDate.getMonth() + (12 * (currentDate.getFullYear() - kafalaDate.getFullYear())) + 1;
            return  Math.abs(monthDifference - kafala.moispayes);
  }

  getRemindersSent(reminders){
    var count = 0;
    for(let reminder of reminders){
      var date = new Date(reminder.date);
      if(date.getMonth == this.currentDate.getMonth )
        count++;
    }
    return count;
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

presentAlert() {
  let alert = this.alertCtrl.create({
    title: ' ارسال التذكيرات ',
    subTitle: '  الى' + this.kafilsWithoutReminders +  ' كفيل؟ ',
  
     buttons: [
      {
        text: 'نعم',
        handler: data => {
         this.confirmSendSMSToAll();
        }
      },
      {
        text: 'لا',
        handler: data => {
         
        }
      }
    ] 
  });
  alert.present();
}
}
