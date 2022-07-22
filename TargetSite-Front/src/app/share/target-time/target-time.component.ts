import { Component, Input } from "@angular/core";
import { TargetTimeModel } from "src/app/domain/model/TargetTime.model";
import { LapTextUtil } from "src/app/utils/LapText.util";

@Component({
    selector: 'app-target-time',
    templateUrl: './target-time.component.html',
    styleUrls: ['./target-time.component.scss']
})
export class TargetTimeComponent {

    /**
     * ターゲット情報
     */
    @Input() target: TargetTimeModel;

    constructor() { }

    /**
     * ヒットしたラップ時間を取得する
     */
    getHitLapText(): string {
        if (!this.target) { return ""; }
        if (this.target.TimeScore.minutes === 0 && this.target.TimeScore.seconds === 0 && this.target.TimeScore.tens === 0) { return ""; }
        return LapTextUtil.FormatLapText(this.target.TimeScore);
    }
}