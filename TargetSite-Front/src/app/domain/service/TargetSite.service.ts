import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { TargetModel } from "../model/Target.model";
import { TargetSiteRepository } from "../repository/TargetSite.repository";

@Injectable({
    providedIn: 'root'
})
export class TargetSiteService {

    private _targetList: TargetModel[];

    private readonly $targetListSubject: BehaviorSubject<TargetModel[]>;
    public readonly $targetListObserver: Observable<TargetModel[]>;

    /** すべてのターゲットがヒットした */
    private readonly $targetAllHitSubject: Subject<boolean>;
    public readonly $targetAllHitObserver: Observable<boolean>;

    /** シューティングの停止フラグ */
    private isStopShooting: boolean;

    constructor(private repository: TargetSiteRepository) {
        this._targetList = [];
        this.isStopShooting = false;
        this.$targetListSubject = new BehaviorSubject<TargetModel[]>([]);
        this.$targetListObserver = this.$targetListSubject.asObservable();

        this.$targetAllHitSubject = new Subject<boolean>();
        this.$targetAllHitObserver = this.$targetAllHitSubject.asObservable();
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
            this._targetList = await this.repository.getTargets();
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
                    if (hit.DeviceId === target.DeviceId) {
                        target.IsHit = true;
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
        let intervalId = null;
        intervalId = setInterval(async () => {
            if (this.isStopShooting) {
                clearInterval(intervalId);
            }
            await this.fetchTargetHitInfo();
        }, 500);
    }

    /**
     * シューティング終了
     */
    public async stopShooting(): Promise<void> {
        try {
            this.isStopShooting = true;
            await this.repository.stopShooting();
            this._targetList.forEach(target => {
                target.IsHit = false;
            });
        } catch (e) {
            throw e;
        }
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