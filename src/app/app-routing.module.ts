import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './component/login/login.component';
import {ForgotPasswordComponent} from './component/forgot-password/forgot-password.component';
import {ResentForgotPasswordComponent} from './component/resent-forgot-password/resent-forgot-password.component';


const routes: Routes = [
    {path: 'home', loadChildren: './feature/feature.module#FeatureModule'},
    {path: 'login', component: LoginComponent},
    {path: 'forgotPassword', component: ForgotPasswordComponent},
    {path: 'resentForgotPassword', component: ResentForgotPasswordComponent},
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
