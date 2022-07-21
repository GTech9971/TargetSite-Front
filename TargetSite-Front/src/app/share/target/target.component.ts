import { Component, Input } from "@angular/core";
import { TargetModel } from "src/app/domain/model/Target.model";

@Component({
    selector: 'app-target',
    templateUrl: './target.component.html',
    styleUrls: ['./target.component.scss']
})
export class TargetComponent {

    @Input() target: TargetModel;

    constructor() { }

}