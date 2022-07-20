import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { TargetModel } from "../model/Target.model";
import { TargetSiteRepository } from "../repository/TargetSite.repository";

@Injectable({
    providedIn: 'root'
})
export class TargetSiteService {

    private _targetList: TargetModel[];

    private readonly $targetListSubject: BehaviorSubject<TargetModel[]>;
    public readonly $targetListObserver: Observable<TargetModel[]>;

    constructor(private repository: TargetSiteRepository) {
        this._targetList = [];
        this.$targetListSubject = new BehaviorSubject<TargetModel[]>([]);
        this.$targetListObserver = this.$targetListSubject.asObservable();
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
                const index: number = hitInfo.findIndex(hit => { return hit.DeviceId === target.DeviceId });
                if (index > 0) {
                    this._targetList[index].IsHit = true;
                }
            });
            this.$targetListSubject.next(this._targetList);
        } catch (e) {
            throw e;
        }
    }

    /**
     * シューティング終了
     */
    public async stopShooting(): Promise<void> {
        try {
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
            return await this.repository.disconnect();
        } catch (e) {
            throw e;
        }
    }
}