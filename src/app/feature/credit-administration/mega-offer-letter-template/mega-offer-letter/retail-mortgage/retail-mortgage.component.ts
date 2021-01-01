import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {DocStatus} from '../../../../loan/model/docStatus';
import {CustomerOfferLetterPath} from '../../../../loan/model/customer-offer-letter-path';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';


@Component({
    selector: 'app-retail-mortgage',
    templateUrl: './retail-mortgage.component.html',
    styleUrls: ['./retail-mortgage.component.scss']
})
export class RetailMortgageComponent implements OnInit {
    @Input() loanDataHolder: LoanDataHolder;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;

    retailForm: FormGroup;
    offerLetterConst = MegaOfferLetterConst;
    initialInfoPrint;
    private existingOfferLetter = false;
    private customerOfferLetter: CustomerOfferLetter;
    private spinner = false;
    private existingRetailForm: any;
    private isSubmitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private customerOfferLetterService: CustomerOfferLetterService,
        private toastService: ToastService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.fillForm();
    }

    buildForm() {
        this.retailForm = this.formBuilder.group({
            name: [undefined],
            date: [undefined],
            address: [undefined],
            mobileNumber: [undefined],
            mortgageOverdraft: [undefined],
            loanLimit: [undefined],
            loanLimitInWords: [undefined],
            timeLimit: [undefined],
            annualInterestRate: [undefined],
            baseInterestRate: [undefined],
            premiumInterestRate: [undefined],
            maxPayment: [undefined],
            fullPaymentFeeBeforeOneYear: [undefined],
            fullPaymentFeeAfterOneYear: [undefined],
            fullPaymentFeeForTransfer: [undefined],
            usedApprovedOverdraft: [undefined],
            assuranceFee: [undefined],
            assuranceFeeInWords: [undefined],
            serviceCharge: [undefined],
            serviceChargeInWords: [undefined],
            kaSuKCharge: [undefined],
            kittaAddress: [undefined],
            kittaNumber: [undefined],
            kittaArea: [undefined],
            spouseName: [undefined],
            overdueInterest: [undefined],
            adhikrit1: [undefined],
            adhikrit2: [undefined],
        });
    }

    fillForm(): void {
        if (this.loanDataHolder.customerOfferLetter) {
            this.loanDataHolder.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
                if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
                    this.existingOfferLetter = true;
                }
            });
        }
        if (!this.existingOfferLetter) {
            if (this.loanDataHolder.customerOfferLetter) {
                this.customerOfferLetterService.detail(this.loanDataHolder.customerOfferLetter.id).subscribe(response => {
                    this.customerOfferLetter = response.detail;
                }, error => {
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
                });
            } else {
                this.customerOfferLetter = new CustomerOfferLetter();
            }
        } else {
            this.customerOfferLetterService.detail(this.loanDataHolder.customerOfferLetter.id).subscribe(response => {
                this.customerOfferLetter = response.detail;
                let initialInfo = null;
                this.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
                    if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
                        initialInfo = JSON.parse(offerLetterPath.initialInformation);
                        this.initialInfoPrint = initialInfo;
                    }
                });
                this.retailForm.patchValue(initialInfo, {emitEvent: false});

            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
            });
        }
        this.retailForm.valueChanges.subscribe((value) => {
            this.retailForm.patchValue(value, {emitEvent: false});
        });
    }

    submit() {
        this.isSubmitted = true;
        this.spinner = true;
        this.customerOfferLetter.docStatus = DocStatus.PENDING;
        const customerLoan = new LoanDataHolder();
        customerLoan.id = this.customerId;
        this.customerOfferLetter.customerLoan = customerLoan;
        if (this.existingRetailForm) {
            this.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
                if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
                    offerLetterPath.initialInformation = JSON.stringify(this.retailForm.value);
                }
            });
        } else {
            const offerLetter = new OfferLetter();
            offerLetter.id = this.offerLetterTypeId;
            const customerOfferLetterPathArray = this.customerOfferLetter.customerOfferLetterPath ?
                this.customerOfferLetter.customerOfferLetterPath : [];
            const customerOfferLetterPath = new CustomerOfferLetterPath();
            customerOfferLetterPath.offerLetter = offerLetter;
            customerOfferLetterPath.initialInformation = JSON.stringify(this.retailForm.value);
            customerOfferLetterPathArray.push(customerOfferLetterPath);
            this.customerOfferLetter.customerOfferLetterPath = customerOfferLetterPathArray;
        }
        // TODO: Assign Supported Information in OfferLetter
        this.customerOfferLetterService.save(this.customerOfferLetter).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.router.navigateByUrl('/home/dashboard').then(value => {
                if (value) {
                    this.router.navigate(['/home/cad-document'], {
                        queryParams: {customerId: this.customerId, }
                    });
                }
            });
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Retail Mortgage Overdraft'));
            this.spinner = false;
        });
    }
}
