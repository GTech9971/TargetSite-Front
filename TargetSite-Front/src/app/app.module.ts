import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TargetSiteRepository } from './domain/repository/TargetSite.repository';
import { MockTargetSiteRepository } from './infra/TargetSiteRepository/MockTargetSite.repository';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: TargetSiteRepository, useClass: MockTargetSiteRepository },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
