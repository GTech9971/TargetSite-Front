import { Component, Input } from "@angular/core";
import { TargetTimeModel } from "src/app/domain/model/TargetTime.model";

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
        // TODO
        return "";
    }
}