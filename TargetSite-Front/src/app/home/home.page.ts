import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TargetSiteService } from '../domain/service/TargetSite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router,
    private alertCtrl: AlertController,
    private targetSiteService: TargetSiteService) { }


  async onClickTimeAttackCard() {
    if (await this.connectDevice()) {
      await this.router.navigate(['time-atk']);
    }
  }

  async onClickNormalCard() {
    if (await this.connectDevice()) {
      await this.router.navigate(['normal']);
    }
  }


  /**
   * デバイスと接続し、ターゲット情報を取得する
   * @returns 
   */
  private async connectDevice(): Promise<boolean> {
    try {
      if (await this.targetSiteService.connect() === false) {
        const alert: HTMLIonAlertElement = await this.alertCtrl.create({ header: 'エラー', message: 'デバイスの接続に失敗しました。' });
        await alert.present();
        return false;
      }

      await this.targetSiteService.fetchTargets();
    } catch (e) {
      const alert: HTMLIonAlertElement = await this.alertCtrl.create({ header: 'エラー', message: e });
      await alert.present();
      return false;
    }
    return true;
  }

}