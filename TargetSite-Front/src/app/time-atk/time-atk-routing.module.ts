import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TimeAtkPage } from "./time-atk.page";

const routes: Routes = [{
    path: '',
    component: TimeAtkPage,
}]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TimeAtkRoutingModule { }