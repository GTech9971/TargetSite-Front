import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TargetComponentModule } from "../target/target.component.module";
import { TargetTimeComponent } from "./target-time.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        TargetComponentModule,
    ], declarations: [TargetTimeComponent],
    exports: [TargetTimeComponent],
})
export class TargetTimeComponentModule { }