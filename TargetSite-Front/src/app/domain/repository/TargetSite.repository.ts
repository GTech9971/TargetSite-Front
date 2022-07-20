import { Injectable } from "@angular/core";
import { TargetModel } from "../model/Target.model";

@Injectable({
    providedIn: 'root'
})
export abstract class TargetSiteRepository {

    /**
     * 接続
     */
    abstract connect(): Promise<boolean>;

    /**
     * ターゲット情報取得
     */
    abstract getTargets(): Promise<TargetModel[]>;

    /**
     * ターゲットのヒット情報
     */
    abstract getTargetHitInfo(): Promise<TargetModel[]>;

    /**
     * シューティング終了
     */
    abstract stopShooting(): Promise<void>;

    /**
     * 切断
     */
    abstract disconnect(): Promise<boolean>;
}