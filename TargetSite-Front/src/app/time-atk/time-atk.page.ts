import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
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

    private readonly $destroy: Subject<boolean>;
    private _targetTimeList: TargetTimeModel[];
    readonly targetTimeListObserver: Observable<TargetTimeModel[]>;

    constructor(private targetSiteTimeAtkService: TargetSiteTimeAtkService) {
        this.$destroy = new Subject<boolean>();
        this._targetTimeList = [];
        this.targetTimeListObserver = this.targetSiteTimeAtkService.$targetListObserver;
        this.targetTimeListObserver.pipe(takeUntil(this.$destroy)).subscribe(targets => {
            this._targetTimeList = targets;
        });
    }


    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    ngOnDestroy(): void {
        throw new Error("Method not implemented.");
    }

    ngAfterViewInit(): void {
        throw new Error("Method not implemented.");
    }


    /** 現在のラップ時間を取得する */
    get getCurrentLap(): string {
        return this.targetSiteTimeAtkService.getCurrentLap();
    }

    /**
     * ターゲットのヒット数文字を取得する
     * @returns 
     */
    getTargetHitCountText(): string {
        // TODO
        return "";
    }
}