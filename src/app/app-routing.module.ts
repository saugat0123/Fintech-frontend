import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './component/login/login.component';

const routes: Routes = [
    {path: 'home', loadChildren: './feature/feature.module#FeatureModule'},
    {path: '', component: LoginComponent}

];

const config: ExtraOptions = {
    useHash: true,
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
