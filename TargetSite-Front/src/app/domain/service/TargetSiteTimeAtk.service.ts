import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { LapTextUtil } from "src/app/utils/LapText.util";
import { LapModel } from "../model/Lap.model";
import { TargetModel } from "../model/Target.model";
import { TargetTimeModel } from "../model/TargetTime.model";
import { TargetSiteRepository } from "../repository/TargetSite.repository";

@Injectable({
    providedIn: 'root'
})
export class TargetSiteTimeAtkService {

    private _targetList: TargetTimeModel[];

    private readonly $targetListSubject: BehaviorSubject<TargetTimeModel[]>;
    public readonly $targetListObserver: Observable<TargetTimeModel[]>;

    /** すべてのターゲットがヒットした */
    private readonly $targetAllHitSubject: Subject<boolean>;
    public readonly $targetAllHitObserver: Observable<boolean>;

    /** シューティングの停止フラグ */
    private isStopShooting: boolean;

    /** ラップ時間用変数 */
    private lastLap: LapModel;
    private workLap: LapModel;

    constructor(private repository: TargetSiteRepository) {
        this._targetList = [];
        this.isStopShooting = false;
        this.$targetListSubject = new BehaviorSubject<TargetTimeModel[]>([]);
        this.$targetListObserver = this.$targetListSubject.asObservable();

        this.$targetAllHitSubject = new Subject<boolean>();
        this.$targetAllHitObserver = this.$targetAllHitSubject.asObservable();

        this.lastLap = { minutes: 0, tens: 0, seconds: 0 };
        this.workLap = { minutes: 0, tens: 0, seconds: 0 };
    }

    /** 現在のラップ時間を取得する */
    public getCurrentLap(): string {
        return LapTextUtil.FormatLapText(this.workLap);
    }

    /**
     * デバイスに接続する
     * @returns 
     */
    public async connect(): Promise<boolean> {
        try {
            return await this.repository.connect();
        } catch (e) {
            throw e
        }
    }

    /**
     * ターゲット情報を取得する
     */
    public async fetchTargets(): Promise<void> {
        try {
            const TARGET_LIST: TargetModel[] = await this.repository.getTargets();
            TARGET_LIST.forEach(target => {
                this._targetList.push({
                    DeviceId: target.DeviceId,
                    IsHit: target.IsHit,
                    TimeScore: { minutes: 0, seconds: 0, tens: 0 }
                });
            });
            this.$targetListSubject.next(this._targetList);
        } catch (e) {
            throw e
        }
    }

    /**
     * ヒット情報を取得する
     */
    public async fetchTargetHitInfo(): Promise<void> {
        try {
            const hitInfo: TargetModel[] = await this.repository.getTargetHitInfo();
            this._targetList.forEach(target => {

                hitInfo.forEach(hit => {
                    if (hit.DeviceId === target.DeviceId && target.IsHit === false) {
                        target.IsHit = true;

                        // ラップ情報作成
                        let lapMinutes: number = this.workLap.minutes - this.lastLap.minutes;
                        if (lapMinutes < 0) {
                            lapMinutes = this.workLap.minutes - this.lastLap.minutes + 60;
                        }
                        let lapseconds: number = this.workLap.seconds - this.lastLap.seconds;
                        if (lapseconds < 0) {
                            lapseconds = this.workLap.seconds - this.lastLap.seconds + 60;
                        }
                        let lapTends: number = this.workLap.tens - this.lastLap.tens;
                        if (lapTends < 0) {
                            lapTends = this.workLap.tens - this.lastLap.tens + 100;
                        }

                        this.lastLap = {
                            minutes: this.workLap.minutes,
                            seconds: this.workLap.seconds,
                            tens: this.workLap.tens
                        };
                        // ラップ情報を設定
                        target.TimeScore = { minutes: lapMinutes, seconds: lapseconds, tens: lapTends };
                    }
                });

            });
            this.$targetListSubject.next(this._targetList);

            // 全ヒット判定
            let hitCount: number = 0;
            this._targetList.forEach(target => {
                if (target.IsHit) { hitCount++; }
            });

            if (hitCount === this._targetList.length) {
                this.$targetAllHitSubject.next(true);
                this.$targetAllHitSubject.next(false);
            }

        } catch (e) {
            throw e;
        }
    }


    /**
     * シューティング開始
     */
    public async startShooting(): Promise<void> {
        this.isStopShooting = false;

        // ラップタイマー開始
        let lapIntervalId = null;
        lapIntervalId = setInterval(() => {
            if (this.isStopShooting) {
                clearInterval(lapIntervalId);
                return;
            }

            this.workLap.tens++;
            if (this.workLap.tens > 99) {
                this.workLap.seconds++;
                this.workLap.tens = 0;
            }

            if (this.workLap.seconds > 59) {
                this.workLap.minutes++;
                this.workLap.seconds = 0;
                this.workLap.tens = 0;
            }
        }, 10);

        // ヒット判定開始
        let intervalId = null;
        intervalId = setInterval(async () => {
            if (this.isStopShooting) {
                clearInterval(intervalId);
                return;
            }
            await this.fetchTargetHitInfo();
        }, 100);
    }

    /**
     * シューティング終了
     */
    public async stopShooting(): Promise<void> {
        try {
            this.isStopShooting = true;
            await this.repository.stopShooting();
        } catch (e) {
            throw e;
        }
    }

    /**
     * ラップの初期化
     * ターゲットのヒット情報の初期化
     */
    public clearData() {
        this.workLap = { minutes: 0, seconds: 0, tens: 0 };
        this.lastLap = { minutes: 0, seconds: 0, tens: 0 };
        this._targetList.forEach(target => {
            target.IsHit = false;
            target.TimeScore = { minutes: 0, seconds: 0, tens: 0 };
        });
        this.$targetListSubject.next(this._targetList);
    }


    /**
     * 切断
     * @returns 
     */
    public async disconnect(): Promise<boolean> {
        try {
            this.isStopShooting = true;
            return await this.repository.disconnect();
        } catch (e) {
            throw e;
        }
    }
}