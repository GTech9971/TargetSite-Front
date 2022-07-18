import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TargetComponent } from "./target.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ], declarations: [TargetComponent],
    exports: [TargetComponent],
})
export class TargetComponentModule { }