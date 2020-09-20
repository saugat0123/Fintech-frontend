import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomerActivityComponent} from './component/customer-activity.component';


export const routes: Routes = [
  {path: '', component: CustomerActivityComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerActivityRoutingModule {
}
