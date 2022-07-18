import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NormalPage } from "./normal.page";

const routes: Routes = [{
    path: '',
    component: NormalPage,
}]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NormalRoutingModule { }