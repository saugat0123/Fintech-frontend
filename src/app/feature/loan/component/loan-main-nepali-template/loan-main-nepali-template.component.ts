import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LoanDataHolder} from '../../model/loanData';
import {NbStepperComponent} from '@nebular/theme';
import {CustomerInfoNepaliComponent} from './customer-info-nepali/customer-info-nepali.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse} from '../../../../@core/utils';
import {ApplicantFamilyInfoComponent} from './applicant-family-info/applicant-family-info.component';
import {Customer} from '../../../admin/modal/customer';
import {HayarParchesKarjaNibedanComponent} from './hayar-parches-karja-nibedan/hayar-parches-karja-nibedan.component';

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
    @ViewChild('applicantFamilyInfoComponent', {static: true}) applicantFamilyInfoComponent: ApplicantFamilyInfoComponent;
    @ViewChild('hayarParchesKarjaInfoComponent', {static: true}) hayarParchesKarjaInfoComponent: HayarParchesKarjaNibedanComponent;
    customer: Customer = new Customer();

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
        this.customer.nepaliDetail = this.customerInfoNepaliComponent.finalData;

        // // Set ApplicantFamilyInfoComponent data
        this.applicantFamilyInfoComponent.onSubmit();
        this.customerLoan.nepaliTemplates = this.applicantFamilyInfoComponent.nepaliTemplates;


        // Set hayarParchesKarjaInfoComponent data
        this.hayarParchesKarjaInfoComponent.submit();
        this.customerLoan.nepaliTemplates = this.hayarParchesKarjaInfoComponent.karjaLoan;


        // Returns the customerLoan inside Map and handle it from Promise
        const map: Map<string, any> = new Map<string, any>();
        map.set('CustomerLoan', this.customerLoan);
        this.ngbActiveModal.close(map);
    }

    onClose() {
        this.ngbActiveModal.close(ModalResponse.CANCEL);
    }
}
