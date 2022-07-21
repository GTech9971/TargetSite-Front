import { Component, Input } from "@angular/core";
import { TargetModel } from "src/app/domain/model/Target.model";

@Component({
    selector: 'app-target-normal',
    templateUrl: './target-normal.component.html',
    styleUrls: ['./target-normal.component.scss']
})
export class TargetNormalComponent {

    @Input() target: TargetModel;

    /**
     * LEDが点灯するかどうか
     */
    get enableGreenLed(): boolean {
        if (!this.target) {
            return false;
        }

        return this.target.IsHit;
    }

    constructor() { }

}