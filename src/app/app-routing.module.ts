import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './component/login/login.component';
import {AuthGuard} from './shared-service/authentication/auth.guard';

const routes: Routes = [
    {path: 'home', loadChildren: './module/module.module#ModuleModule'},
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
