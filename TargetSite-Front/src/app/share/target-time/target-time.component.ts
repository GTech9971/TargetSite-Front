import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-target-time',
    templateUrl: './target-time.component.html',
    styleUrls: ['./target-time.component.scss']
})
export class TargetTimeComponent {

    /**
     * 的にヒットした時間 mm:ss
     */
    @Input() timeScore: string;

    constructor() { }
}