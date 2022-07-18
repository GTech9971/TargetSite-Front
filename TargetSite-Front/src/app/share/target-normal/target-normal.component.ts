import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-target-normal',
    templateUrl: './target-normal.component.html',
    styleUrls: ['./target-normal.component.scss']
})
export class TargetNormalComponent {

    /**
     * 緑色のLEDを点灯させる
     */
    @Input() enableGreenLed: boolean;

    constructor() {
        this.enableGreenLed = false;
    }

}