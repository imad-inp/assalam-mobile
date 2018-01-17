import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';


import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../providers/auth-service/auth-service';
import { DataServiceProvider } from '../providers/data-service/data-service';

import { ExpandableComponent } from '../components/expandable/expandable';
import { Platform } from 'ionic-angular';
import { ReminderProvider } from '../providers/reminder/reminder';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ExpandableComponent,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage, 
    ExpandableComponent,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    DataServiceProvider,
    SMS,
    CallNumber,
    ReminderProvider
    
 
  ]
})
export class AppModule {}
