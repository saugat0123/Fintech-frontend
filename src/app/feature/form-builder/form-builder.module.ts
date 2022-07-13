import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilderAddComponent} from './form-builder-add/form-builder-add.component';
import {NbTabsetModule} from '@nebular/theme';
import {CoreModule} from '../../@core/core.module';
import {ThemeModule} from '../../@theme/theme.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {DynamicFormsComponent} from './dynamic-forms/dynamic-forms.component';
import {ReactiveFormsModule} from '@angular/forms';
import {DynamicFormListComponent} from './dynamic-form-list/dynamic-form-list.component';
import {FormBuilderRoutingModule} from './form-builder.routing.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {AddressFormAddComponent} from './form-builder-add/address-form-add/address-form-add.component';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {InputTextAddComponent} from './form-builder-add/input-text-add/input-text-add.component';
import {InputDateAddComponent} from './form-builder-add/input-date-add/input-date-add.component';
import {InputTextareaAddComponent} from './form-builder-add/input-textarea-add/input-textarea-add.component';
import {InputSelectAddComponent} from './form-builder-add/input-select-add/input-select-add.component';
import {InputRadioAddComponent} from './form-builder-add/input-radio-add/input-radio-add.component';
import {LineBreakAddComponent} from './form-builder-add/line-break-add/line-break-add.component';
import {AddressFormComponent} from './dynamic-forms/address-form/address-form.component';
import { InputTextFormComponent } from './dynamic-forms/input-text-form/input-text-form.component';
import { InputTextareaFormComponent } from './dynamic-forms/input-textarea-form/input-textarea-form.component';
import { InputSelectFormComponent } from './dynamic-forms/input-select-form/input-select-form.component';
import { InputDateFormComponent } from './dynamic-forms/input-date-form/input-date-form.component';
import { FormInvalidFocusDirective } from './dynamic-forms/form-invalid-focus.directive';
import { InputRadioFormComponent } from './dynamic-forms/input-radio-form/input-radio-form.component';
import { InputArrayAddComponent } from './form-builder-add/input-array-add/input-array-add.component';
import { DoubleClickDirective } from './form-builder-add/double-click.directive';
import { ArrayFormComponent } from './dynamic-forms/array-form/array-form.component';
import { CommonDataViewComponent } from './common-data-view/common-data-view.component';


@NgModule({
    declarations: [FormBuilderAddComponent, AddressFormComponent,
        DynamicFormsComponent, DynamicFormListComponent,
        AddressFormAddComponent, InputTextAddComponent,
        InputDateAddComponent, InputTextareaAddComponent,
        InputSelectAddComponent, InputRadioAddComponent,
        LineBreakAddComponent, InputTextFormComponent,
        InputTextareaFormComponent, InputSelectFormComponent,
        InputDateFormComponent, FormInvalidFocusDirective,
        InputRadioFormComponent, InputArrayAddComponent,
        DoubleClickDirective, ArrayFormComponent, CommonDataViewComponent],
    exports: [
        FormBuilderAddComponent,
        DynamicFormsComponent,
        AddressFormAddComponent,
        AddressFormComponent
    ],
    imports: [
        CommonModule,
        NbTabsetModule,
        CoreModule,
        ThemeModule,
        DragDropModule,
        ReactiveFormsModule,
        FormBuilderRoutingModule,
        NgSelectModule,
        NepaliCalendarModule
    ],
    entryComponents: [DynamicFormsComponent, AddressFormAddComponent, AddressFormComponent]
})
export class FormBuilderModule {
}
