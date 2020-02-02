import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DocStatus} from '../../../model/docStatus';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {CustomerOfferLetterPath} from '../../../model/customer-offer-letter-path';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {CustomerOfferLetterService} from '../../../service/customer-offer-letter.service';
import {Router} from '@angular/router';
import {OfferLetterConst} from '../model/offer-letter-const';

@Component({
    selector: 'app-pratigya-patra',
    templateUrl: './pratigya-patra.component.html',
    styleUrls: ['./pratigya-patra.component.scss']
})
export class PratigyaPatraComponent implements OnInit {
    @Input() loanDataHolder: LoanDataHolder;
    customerOfferLetter: CustomerOfferLetter;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;
    offerForm: FormGroup;
    spinner = false;
    offerLetterConst = OfferLetterConst;
    initialInfoPrint;
    existingOfferLetter = false;
    constructor(private offerBuilder: FormBuilder,
                private tService: ToastService,
                private OfferLetterService: CustomerOfferLetterService,
                private router: Router) {
    }

    ngOnInit() {
        this.buildForm();
        this.fillForm();
    }
    buildForm() {
        this.offerForm = this.offerBuilder.group({
            loanamount: [undefined] ,
            companyno: [undefined] ,
            companyname: [undefined] ,
            loanamount2: [undefined] ,
            customerName: [undefined] ,
            interestamount: [undefined] ,
            amountinword: [undefined]
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
                this.OfferLetterService.detail(this.loanDataHolder.customerOfferLetter.id).subscribe(response => {
                    this.customerOfferLetter = response.detail;
                }, error => {
                    console.error(error);
                    this.tService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
                });
            } else {
                this.customerOfferLetter = new CustomerOfferLetter();
            }
            // (this.form.get('securityGuarantorRemaining') as FormArray).push(this.securityGuarantorRemainingFormGroup(null));
        } else {
            this.OfferLetterService.detail(this.loanDataHolder.customerOfferLetter.id).subscribe(response => {
                this.customerOfferLetter = response.detail;
                let initialInfo = null;
                this.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
                    if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
                        initialInfo = JSON.parse(offerLetterPath.initialInformation);
                        this.initialInfoPrint = initialInfo;
                    }
                });
                this.offerForm.patchValue(initialInfo, {emitEvent: false});
                // initialInfo.securityGuarantorRemaining.forEach(info => {
                //     (this.form.get('securityGuarantorRemaining') as FormArray).push(
                //         this.securityGuarantorRemainingFormGroup(
                //             {
                //                 name: info.name,
                //                 amount: info.amount,
                //                 amountInWords: info.amountInWords
                //             }
                //         )
                //     );
                // });
            }, error => {
                console.error(error);
                this.tService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
            });
        }
        this.offerForm.valueChanges.subscribe((value) => {
            this.offerForm.patchValue(value, {emitEvent: false});
        });
    }
    submit(): void {
        this.spinner = true;
        this.customerOfferLetter.docStatus = DocStatus.PENDING;
        const customerLoan = new LoanDataHolder();
        customerLoan.id = this.customerId;
        this.customerOfferLetter.customerLoan = customerLoan;
        if (this.existingOfferLetter) {
            this.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
                if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
                    offerLetterPath.initialInformation = JSON.stringify(this.offerForm.value);
                }
            });
        } else {
            const offerLetter = new OfferLetter();
            offerLetter.id = this.offerLetterTypeId;
            const customerOfferLetterPathArray = this.customerOfferLetter.customerOfferLetterPath ?
                this.customerOfferLetter.customerOfferLetterPath : [];
            const customerOfferLetterPath = new CustomerOfferLetterPath();
            customerOfferLetterPath.offerLetter = offerLetter;
            customerOfferLetterPath.initialInformation = JSON.stringify(this.offerForm.value);
            customerOfferLetterPathArray.push(customerOfferLetterPath);
            this.customerOfferLetter.customerOfferLetterPath = customerOfferLetterPathArray;
        }

        this.OfferLetterService.save(this.customerOfferLetter).subscribe(() => {
            this.tService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
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
            this.tService.show(new Alert(AlertType.ERROR, 'Failed to save Pratigya patra Offer Letter'));
            this.spinner = false;
        });
    }
}
