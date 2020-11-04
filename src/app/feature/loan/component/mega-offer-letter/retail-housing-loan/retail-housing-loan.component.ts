import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {LoanDataHolder} from '../../../model/loanData';
import {Router} from '@angular/router';
import {CustomerOfferLetterService} from '../../../service/customer-offer-letter.service';
import {ToastService} from '../../../../../@core/utils';
import {OfferLetterConst} from '../../offer-letter/model/offer-letter-const';
import {DocStatus} from '../../../model/docStatus';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {CustomerOfferLetterPath} from '../../../model/customer-offer-letter-path';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';
import {MegaOfferLetterConst} from "../model/mega-offer-letter-const";

@Component({
    selector: 'app-retail-housing-loan',
    templateUrl: './retail-housing-loan.component.html',
    styleUrls: ['./retail-housing-loan.component.scss']
})
export class RetailHousingLoanComponent implements OnInit {
    spinner = false;
    form: FormGroup;
    megaofferLetterConst = MegaOfferLetterConst;
    customerOfferLetter: CustomerOfferLetter;
    @Input() loanDataHolder: LoanDataHolder;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;
    existingOfferLetter = false;
    initialInfoPrint;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private customerOfferLetterService: CustomerOfferLetterService,
        private toastService: ToastService) {
    }

    ngOnInit() {
        this.buildForm();
        this.fillForm();

    }

    buildForm() {
        this.form = this.formBuilder.group({
            date: [undefined],
            loanData: this.formBuilder.array([]),
            referenceNo: [undefined],
            applicantRelative: [undefined],
            applicantName: [undefined],
            parmanentAddress: [undefined],
            currentAddress: [undefined],
            mobileNo: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            loanAmountReturn: [undefined],
            loanAmountReturnInWord: [undefined],
            loanRate: [undefined],
            month: [undefined],
            prices: [undefined],
            clearanceDate: [undefined],
            district: [undefined],
            wardNo: [undefined],
            statekeyNo: [undefined],
            keyNo: [undefined]
        });
    }

    removeLoanDetail(index) {
        (this.form.get('loanData') as FormArray).removeAt(index);
    }

    addTableData() {
        (this.form.get('loanData') as FormArray).push(
            this.formBuilder.group({
                description: [undefined],
                sumInsured: [undefined],
                riskBearer: [undefined]
            })
        );
    }

    fillForm() {
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
            this.addTableData();
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
                this.form.patchValue(initialInfo, {emitEvent: false});
                initialInfo.loanData.forEach((data) => {
                    (this.form.get('loanData') as FormArray).push(
                        this.formBuilder.group({
                            description: [data.description],
                            sumInsured: [data.sumInsured],
                            riskBearer: [data.riskBearer]
                        })
                    );

                });
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
            });
        }
    }

    submit() {
        this.spinner = true;
        this.customerOfferLetter.docStatus = DocStatus.PENDING;
        const customerLoan = new LoanDataHolder();
        customerLoan.id = this.customerId;
        this.customerOfferLetter.customerLoan = customerLoan;
        if (this.existingOfferLetter) {
            this.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
                if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerLetter = new OfferLetter();
            offerLetter.id = this.offerLetterTypeId;
            const customerOfferLetterPathArray = this.customerOfferLetter.customerOfferLetterPath ?
                this.customerOfferLetter.customerOfferLetterPath : [];
            const customerOfferLetterPath = new CustomerOfferLetterPath();
            customerOfferLetterPath.offerLetter = offerLetter;
            customerOfferLetterPath.initialInformation = JSON.stringify(this.form.value);
            customerOfferLetterPathArray.push(customerOfferLetterPath);
            this.customerOfferLetter.customerOfferLetterPath = customerOfferLetterPathArray;
        }
        // TODO: Assign Supported Information in OfferLetter
        this.customerOfferLetterService.save(this.customerOfferLetter).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.router.navigateByUrl('/home/dashboard').then(value => {
                if (value) {
                    this.router.navigate(['/home/loan/offer-letter'], {
                        queryParams: {customerId: this.customerId, }
                    });
                }
            });
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Retail Housing Loan'));
            this.spinner = false;
        });
    }
}
