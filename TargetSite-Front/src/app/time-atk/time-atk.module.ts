import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TargetTimeComponentModule } from "../share/target-time/target-time.component.module";
import { TargetComponentModule } from "../share/target/target.component.module";
import { TimeAtkRoutingModule } from "./time-atk-routing.module";
import { TimeAtkPage } from "./time-atk.page";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        TimeAtkRoutingModule,
        TargetTimeComponentModule,
    ], declarations: [TimeAtkPage]
})
export class TimeAtkModule { }