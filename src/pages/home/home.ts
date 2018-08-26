import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service/auth-service';
import { ListPage } from '../list/list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loading: any;
  loginData = { username: localStorage.getItem('username') ?  localStorage.getItem('username'): '', password: localStorage.getItem('password') ?  localStorage.getItem('password'): '' };
  data: any;

  constructor(public navCtrl: NavController, public authService: AuthService,  public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
      
  }

  doLogin() {
    this.showLoader();
    localStorage.setItem('username', this.loginData.username);
    localStorage.setItem('password', this.loginData.password);
    this.authService.authenticate(this.loginData).then((result) => {
      this.loading.dismiss();
      this.data = result;
      localStorage.setItem('token', this.data.id_token);
    
      this.navCtrl.setRoot(ListPage);
    }, (err) => {
      this.loading.dismiss();
      this.presentToast('لم نتمكن من التحقق من هويتكم، المرجو اعادة المحاولة');
    });
  }

 

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: 'جاري تسجيل الدخول ...'
    });

    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
