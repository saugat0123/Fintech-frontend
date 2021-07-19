import {Routes} from "@angular/router";
import {CreditMemoTypeComponent} from "./component/credit-memo-type/credit-memo-type.component";

export const CreditMemoRoutes: Routes =[
    {path: 'type', component: CreditMemoTypeComponent},
    {path: '**', redirectTo: 'inbox', pathMatch: 'full'}
];
