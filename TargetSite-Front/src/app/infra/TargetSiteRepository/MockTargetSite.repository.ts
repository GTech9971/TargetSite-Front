import { Injectable } from "@angular/core";
import { TargetModel } from "src/app/domain/model/Target.model";
import { TargetSiteRepository } from "src/app/domain/repository/TargetSite.repository";

@Injectable({
    providedIn: 'root'
})
export class MockTargetSiteRepository extends TargetSiteRepository {

    async connect(): Promise<boolean> {
        return true;
    }

    async getTargets(): Promise<TargetModel[]> {
        return [
            {
                DeviceId: 0,
                IsHit: false,
            },
            {
                DeviceId: 1,
                IsHit: false,
            },
            {
                DeviceId: 2,
                IsHit: false,
            },
            {
                DeviceId: 3,
                IsHit: false,
            }
        ];
    }


    private count: number = 0;
    private target: TargetModel[] = [];

    async getTargetHitInfo(): Promise<TargetModel[]> {
        const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
        await sleep(1000 + this.count + 1 * 123);

        if (this.count === 4) {
            this.count = 0;
        }

        this.target.push({
            DeviceId: this.count,
            IsHit: true
        });
        this.count++;

        return this.target;
    }

    async stopShooting(): Promise<void> {
    }

    async disconnect(): Promise<boolean> {
        return true;
    }

}