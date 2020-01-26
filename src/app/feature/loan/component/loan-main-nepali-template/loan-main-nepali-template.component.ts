import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LoanDataHolder} from '../../model/loanData';
import {NbStepperComponent} from '@nebular/theme';
import {CustomerInfoNepaliComponent} from './customer-info-nepali/customer-info-nepali.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse} from '../../../../@core/utils';

@Component({
    selector: 'app-loan-main-nepali-template',
    templateUrl: './loan-main-nepali-template.component.html',
    styleUrls: ['./loan-main-nepali-template.component.scss']
})
export class LoanMainNepaliTemplateComponent implements OnInit {
    @Input() customerLoan: LoanDataHolder;
    @ViewChild('nepaliTemplateStepper', {static: true}) nepaliTemplateStepper: NbStepperComponent;
    stepperButtonVisibility = {
        showPrevious: false,
        showNext: true,
        showSave: false
    };
    @ViewChild('customerInfoNepaliComponent', {static: true}) customerInfoNepaliComponent: CustomerInfoNepaliComponent;

    constructor(private ngbActiveModal: NgbActiveModal) {
    }

    ngOnInit() {
    }

    stepperPrevious(): void {
        this.nepaliTemplateStepper.previous();
        this.changeStepperButtonVisibility();
    }

    stepperNext(): void {
        this.nepaliTemplateStepper.next();
        this.changeStepperButtonVisibility();
    }

    changeStepperButtonVisibility(): void {
        this.stepperButtonVisibility.showPrevious = this.nepaliTemplateStepper.selectedIndex !== 0;
        this.stepperButtonVisibility.showNext = this.nepaliTemplateStepper.selectedIndex < (this.nepaliTemplateStepper.steps.length - 1);
        this.stepperButtonVisibility.showSave = this.nepaliTemplateStepper.selectedIndex === (this.nepaliTemplateStepper.steps.length - 1);
    }

    save(): void {
        // Set CustomerInfoNepaliComponent data
        this.customerInfoNepaliComponent.onSubmit();
        this.customerLoan.customerInfo.nepaliDetail = this.customerInfoNepaliComponent.finalData;
        /**
         * TODO: Pass other nepali templates data as an array of `NepaliTemplateDataHolder` inside `loanDataHolder`
         * Your code would be something like:
         * const nepaliTemplates: Array<NepaliTemplateDataHolder> = new Array<NepaliTemplateDataHolder>();
         * Pass the data here inside the array.
         *
         * And, set the array into `LoanDataHolder`
         * this.customerLoan.nepaliTemplates = nepaliTemplates;
         */

        // Returns the customerLoan inside Map and handle it from Promise
        const map: Map<string, any> = new Map<string, any>();
        map.set('CustomerLoan', this.customerLoan);
        this.ngbActiveModal.close(map);
    }

    onClose() {
        this.ngbActiveModal.close(ModalResponse.CANCEL);
    }
}
