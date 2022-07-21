import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { Observable, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { TargetModel } from "../domain/model/Target.model";
import { TargetSiteService } from "../domain/service/TargetSite.service";

@Component({
    selector: 'app-normal',
    templateUrl: './normal.page.html',
    styleUrls: ['./normal.page.scss']
})
export class NormalPage implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild("startmodal") startModal: HTMLIonModalElement;
    @ViewChild("clearmodal") clearModal: HTMLIonModalElement;

    private readonly destroy$: Subject<boolean>;

    _targetList: TargetModel[];
    readonly targetObserver: Observable<TargetModel[]>;

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
        private targetSiteService: TargetSiteService,) {

        this.destroy$ = new Subject<boolean>();
        this.countDown = 4;
        this._targetList = [];
        this.showHitFlg = false;
        this.MUSIC = new Audio('/assets/Countdown06-2.mp3');

        this.targetObserver = this.targetSiteService.$targetListObserver;
        this.targetObserver.pipe(takeUntil(this.destroy$)).subscribe(targets => {
            this._targetList = targets;
        });

        this.targetAllHitObserver = this.targetSiteService.$targetAllHitObserver;
        this.targetAllHitObserver.pipe(takeUntil(this.destroy$)).subscribe(isAllHit => {
            if (isAllHit && this.showHitFlg === false) {
                this.showHitFlg = true;
                this.clearModal.present();
            }
        });
    }

    async ngOnInit() {
        if (this._targetList.length === 0) {
            try {
                await this.targetSiteService.connect();
                await this.targetSiteService.fetchTargets();
            } catch (e) {
                const alert: HTMLIonAlertElement = await this.alrtCtrl.create({ header: 'エラー', message: e });
                await alert.present();
                await this.router.navigate(['home']);
            }
        }
    }

    /**開始モーダル表示 */
    async ngAfterViewInit() {
        await this.startModal.present();
    }


    /**
     * 画面終了時
     * フラグの初期化
     * 購読解除
     */
    async ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.showHitFlg = false;
        this.countDown = 4;

        try {
            await this.targetSiteService.stopShooting();
            await this.targetSiteService.disconnect();
        } catch (e) {
            const alert: HTMLIonAlertElement = await this.alrtCtrl.create({ header: 'エラー', message: e });
            await alert.present();
        }
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
                await this.targetSiteService.startShooting();
            }
        }, 1000);
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

    /**
     * クリアモーダル閉じたイベント
     * ホームに戻る
     */
    async onDissmiss() {
        await this.router.navigate(['home']);
    }

}