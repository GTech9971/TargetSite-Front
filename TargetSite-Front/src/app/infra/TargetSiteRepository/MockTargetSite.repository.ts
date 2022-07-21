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

    async getTargetHitInfo(): Promise<TargetModel[]> {
        return [
            {
                DeviceId: 0,
                IsHit: true,
            },
            {
                DeviceId: 1,
                IsHit: true,
            },
            {
                DeviceId: 2,
                IsHit: true,
            },
            {
                DeviceId: 3,
                IsHit: true,
            }
        ];
    }

    async stopShooting(): Promise<void> {
    }

    async disconnect(): Promise<boolean> {
        return true;
    }

}