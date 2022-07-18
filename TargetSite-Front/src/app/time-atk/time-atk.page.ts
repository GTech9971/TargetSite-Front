import { Component } from "@angular/core";

@Component({
    selector: 'app-time-atk',
    templateUrl: './time-atk.page.html',
    styleUrls: ['./time-atk.page.scss']
})
export class TimeAtkPage {
    constructor() {

    }

    getCurrentTime(): string {
        return new Date().toTimeString();
    }
}