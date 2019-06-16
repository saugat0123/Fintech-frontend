import {Component, Input} from '@angular/core';
import {Violation} from '../../../@core/utils/modal/Violation';

@Component({
    selector: 'app-validation-error',
    templateUrl: './validation-error.component.html',
})
export class ValidationErrorComponent {

    @Input()
    errors: Array<Violation>;

    constructor() {
    }

    close() {
        this.errors = null;
    }
}
