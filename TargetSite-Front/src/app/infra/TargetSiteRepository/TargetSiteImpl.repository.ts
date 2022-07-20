import { Injectable } from "@angular/core";
import { TargetModel } from "src/app/domain/model/Target.model";
import { TargetSiteRepository } from "src/app/domain/repository/TargetSite.repository";

@Injectable({
    providedIn: 'root'
})
export class TargetSiteImplRepository extends TargetSiteRepository {
    /** ベンダーID */
    private readonly VID: number = 0x00;
    /** プロダクトID */
    private readonly PID: number = 0x00;

    private hidDevices: HIDDevice[];
    private targetDevice: HIDDevice;

    constructor() {
        super();
        this.hidDevices = [];
    }

    async connect(): Promise<boolean> {
        this.hidDevices = await navigator.hid.requestDevice({
            filters: [{
                vendorId: this.VID,
                productId: this.PID
            }]
        });

        this.targetDevice = this.hidDevices[0];
        if (!this.targetDevice) {
            return false;
        }

        await this.targetDevice.open();
        return true;
    }

    async getTargets(): Promise<TargetModel[]> {
        return new Promise((resolve, rejects) => {
            if (!this.targetDevice) {
                rejects("デバイスが見つかりません");
            }

            if (this.targetDevice.opened === false) {
                rejects("デバイスに接続されていません");
            }

            // 受信イベント作成
            this.targetDevice.addEventListener("inputreport", event => {
                const eventInfo: HIDInputReportEvent = event as HIDInputReportEvent;

                if (eventInfo.data.getUint8(0) !== 0x70) {
                    rejects("デバイスの取得に失敗しました。");
                }

                // ターゲット数の取得
                const targetCounts: number = eventInfo.data.getUint8(1);
                // ターゲットの生成
                let targetList: TargetModel[] = [];
                let mask: number = 0x80;
                for (let i = 0; i < 8; i++) {
                    if (eventInfo.data.getUint8(2) & mask) {
                        targetList.push({
                            DeviceId: mask,
                            IsHit: false
                        });
                    }
                    mask >>= 1;
                }

                if (targetCounts !== targetList.length) { rejects("データが不正です"); }

                resolve(targetList);
            });

            //受信イベントを生成してからコマンド送信
            this.targetDevice.sendReport(0, this.createCMd(0x70));
        });
    }

    async getTargetHitInfo(): Promise<TargetModel[]> {
        return new Promise((resolve, rejects) => {
            if (!this.targetDevice) {
                rejects("デバイスが見つかりません");
            }

            if (this.targetDevice.opened === false) {
                rejects("デバイスに接続されていません");
            }

            // TODO:いらんかも イベント削除 
            this.targetDevice.removeEventListener("inputreport", () => { });

            // 受信イベント作成
            this.targetDevice.addEventListener("inputreport", event => {
                const eventInfo: HIDInputReportEvent = event as HIDInputReportEvent;

                if (eventInfo.data.getUint8(0) !== 0x60) {
                    rejects("デバイスの取得に失敗しました。");
                }

                // ターゲット数の取得
                const targetCounts: number = eventInfo.data.getUint8(1);
                // ターゲットの生成
                let targetList: TargetModel[] = [];
                let mask: number = 0x80;
                for (let i = 0; i < 8; i++) {
                    if (eventInfo.data.getUint8(2) & mask) {
                        targetList.push({
                            DeviceId: mask,
                            IsHit: true
                        });
                    }
                    mask >>= 1;
                }

                if (targetCounts !== targetList.length) { rejects("データが不正です"); }

                resolve(targetList);
            });

            //受信イベントを生成してからコマンド送信
            this.targetDevice.sendReport(0, this.createCMd(0x60));
        });
    }

    async stopShooting(): Promise<void> {
        if (!this.targetDevice) {
            throw "デバイスが見つかりません";
        }

        if (this.targetDevice.opened === false) {
            throw "デバイスに接続されていません";
        }

        await this.targetDevice.sendReport(0, this.createCMd(0x10));
    }

    async disconnect(): Promise<boolean> {
        if (!this.targetDevice) {
            return false;
        }

        await this.targetDevice.close();
        return true;
    }

    private createCMd(cmd: number): Uint8Array {
        const CMD: number[] = [cmd, 0, 0, 0, 0, 0, 0, 0];
        return new Uint8Array(CMD);
    }

}