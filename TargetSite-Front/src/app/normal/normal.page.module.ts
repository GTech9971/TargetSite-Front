import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TargetNormalComponentModule } from "../share/target-normal/target-normal.component.module";
import { TargetComponentModule } from "../share/target/target.component.module";
import { NormalRoutingModule } from "./normal-routing.module";
import { NormalPage } from "./normal.page";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        NormalRoutingModule,
        TargetNormalComponentModule,
    ], declarations: [NormalPage]
})
export class NormalPageModule { }