import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './component/login/login.component';
import {ForgotPasswordComponent} from './component/forgot-password/forgot-password.component';
import {ResentForgotPasswordComponent} from './component/resent-forgot-password/resent-forgot-password.component';
import {LoginBaseComponent} from './component/login-base/login-base.component';
import {NewPasswordComponent} from './component/new-password/new-password.component';
import {AuthGuard} from './shared-service/authentication/auth.guard';
import {LoginGuard} from './shared-service/authentication/login.guard';


const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: '', component: LoginBaseComponent, children: [
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [LoginGuard]
            },
            {
                path: 'forgotPassword',
                component: ForgotPasswordComponent,
                canActivate: [LoginGuard]
            },
            {
                path: 'resentForgotPassword',
                component: ResentForgotPasswordComponent,
                canActivate: [LoginGuard]
            },
            {
                path: 'newPassword',
                component: NewPasswordComponent
            }
        ]
    },
    {
        path: 'home',
        loadChildren: './feature/feature.module#FeatureModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
    },
    { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

const config: ExtraOptions = {
    useHash: true,
    onSameUrlNavigation: 'reload'
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
