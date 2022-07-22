import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TargetTimeModel } from "../domain/model/TargetTime.model";
import { TargetSiteTimeAtkService } from "../domain/service/TargetSiteTimeAtk.service";

@Component({
    selector: 'app-time-atk',
    templateUrl: './time-atk.page.html',
    styleUrls: ['./time-atk.page.scss']
})
export class TimeAtkPage implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild("startmodal") startModal: HTMLIonModalElement;
    @ViewChild("clearmodal") clearModal: HTMLIonModalElement;

    private readonly destroy$: Subject<boolean>;
    private _targetTimeList: TargetTimeModel[];
    readonly targetTimeListObserver: Observable<TargetTimeModel[]>;

    /** ターゲット全ヒット判定 */
    readonly targetAllHitObserver: Observable<boolean>;

    /** カウントダウン音源 */
    readonly MUSIC: HTMLAudioElement;

    /** カウントダウン変数 */
    countDown: number;

    /** クリアモーダル表示フラグ */
    private showHitFlg: boolean;

    constructor(private router: Router,
        private alrtCtrl: AlertController,
        private targetSiteTimeAtkService: TargetSiteTimeAtkService) {
        this.destroy$ = new Subject<boolean>();
        this._targetTimeList = [];

        this.countDown = 4;
        this.showHitFlg = false;
        this.MUSIC = new Audio('/assets/Countdown06-2.mp3');

        this.targetTimeListObserver = this.targetSiteTimeAtkService.$targetListObserver;
        this.targetTimeListObserver.pipe(takeUntil(this.destroy$)).subscribe(targets => {
            this._targetTimeList = targets;
        });

        this.targetAllHitObserver = this.targetSiteTimeAtkService.$targetAllHitObserver;
        this.targetAllHitObserver.pipe(takeUntil(this.destroy$)).subscribe(isAllHit => {
            if (isAllHit && this.showHitFlg === false) {
                this.showHitFlg = true;
                this.targetSiteTimeAtkService.stopShooting();
                this.clearModal.present();
            }
        });
    }


    async ngOnInit() {
        if (this._targetTimeList.length === 0) {
            try {
                await this.targetSiteTimeAtkService.connect();
                await this.targetSiteTimeAtkService.fetchTargets();
            } catch (e) {
                const alert: HTMLIonAlertElement = await this.alrtCtrl.create({ header: 'エラー', message: e });
                await alert.present();
                await this.router.navigate(['home']);
            }
        }
    }

    async ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.showHitFlg = false;
        this.countDown = 4;

        // データをクリア
        this.targetSiteTimeAtkService.clearData();

        try {
            await this.targetSiteTimeAtkService.stopShooting();
            await this.targetSiteTimeAtkService.disconnect();
        } catch (e) {
            const alert: HTMLIonAlertElement = await this.alrtCtrl.create({ header: 'エラー', message: e });
            await alert.present();
        }
    }

    /**開始モーダル表示 */
    async ngAfterViewInit() {
        await this.startModal.present();
    }


    /** 現在のラップ時間を取得する */
    get getCurrentLap(): string {
        return this.targetSiteTimeAtkService.getCurrentLap();
    }

    /**
    * 開始ボタン
    * カウントダウン音源再生
    * カウントダウン開始
    * カウントダウン完了後シューティング開始
    */
    async onClickStartBtn() {
        this.countDown--;
        await this.MUSIC.play();

        let id = null;
        id = setInterval(async () => {
            this.countDown--;
            if (this.countDown === 0) {
                clearInterval(id);
                await this.startModal.dismiss();
                await this.targetSiteTimeAtkService.startShooting();
            }
        }, 1000);
    }

    /**
     * ターゲットのヒット数文字を取得する
     * @returns 
     */
    getTargetHitCountText(): string {
        let hitSum: number = 0;
        this._targetTimeList.forEach(t => {
            if (t.IsHit) {
                hitSum++;
            }
        });
        return `${hitSum}/${this._targetTimeList.length}`;
    }

    /**
    * クリアモーダル閉じたイベント
    * ホームに戻る
    */
    async onDissmiss() {
        await this.router.navigate(['home']);
    }
}