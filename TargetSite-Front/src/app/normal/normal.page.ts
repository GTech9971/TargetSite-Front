import { Component, OnDestroy, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { Observable } from "rxjs";
import { TargetModel } from "../domain/model/Target.model";
import { TargetSiteService } from "../domain/service/TargetSite.service";

@Component({
    selector: 'app-normal',
    templateUrl: './normal.page.html',
    styleUrls: ['./normal.page.scss']
})
export class NormalPage implements OnInit, OnDestroy {

    _targetList: TargetModel[];
    readonly targetObserver: Observable<TargetModel[]>;

    constructor(private alertCtrl: AlertController,
        private targetSiteService: TargetSiteService,) {

        this._targetList = [];

        this.targetObserver = this.targetSiteService.$targetListObserver;
        this.targetObserver.subscribe(targets => {
            this._targetList = targets;
        });
    }

    async ngOnInit() {
        if (this._targetList.length === 0) {
            // TODO:例外処理
            await this.targetSiteService.connect();
            await this.targetSiteService.fetchTargets();
        }

        // TODO 仮実装
        this.targetSiteService.startShooting();
    }

    async ngOnDestroy() {
        // TODO:例外処理
        await this.targetSiteService.stopShooting();
        await this.targetSiteService.disconnect();
    }


    /**
     * ヒット数/ターゲット数を出力する
     */
    getHitCountText(): string {
        let hitSum: number = 0;
        this._targetList.forEach(t => {
            if (t.IsHit) {
                hitSum++;
            }
        });
        return `${hitSum}/${this._targetList.length}`;
    }

}