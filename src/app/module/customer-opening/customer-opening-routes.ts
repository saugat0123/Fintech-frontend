import {Routes} from '@angular/router';
import {CustomerBaseComponent} from './component/customer-base/customer-base.component';
import {CustomerFormComponent} from './component/customer-form/customer-form.component';

export const CustomerOpeningRoutes: Routes = [
    {
        path: '', component: CustomerBaseComponent, children: [
            {path: 'open/:id', component: CustomerFormComponent}
        ]
    }
];
