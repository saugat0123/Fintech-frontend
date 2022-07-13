import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DynamicFormListComponent} from './dynamic-form-list/dynamic-form-list.component';
import {FormBuilderAddComponent} from './form-builder-add/form-builder-add.component';

export const routes: Routes = [
    {path: 'list', component: DynamicFormListComponent},
    {path: 'edit/:id', component: FormBuilderAddComponent},
    {path: 'add', component: FormBuilderAddComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FormBuilderRoutingModule {
}
