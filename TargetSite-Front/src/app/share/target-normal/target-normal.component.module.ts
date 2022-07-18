import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TargetComponentModule } from "../target/target.component.module";
import { TargetNormalComponent } from "./target-normal.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        TargetComponentModule,
    ], declarations: [TargetNormalComponent],
    exports: [TargetNormalComponent],
})
export class TargetNormalComponentModule { }