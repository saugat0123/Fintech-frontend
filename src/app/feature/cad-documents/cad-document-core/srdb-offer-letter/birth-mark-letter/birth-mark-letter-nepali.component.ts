import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {DocStatus} from '../../../../loan/model/docStatus';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerOfferLetterPath} from '../../../../loan/model/customer-offer-letter-path';

@Component({
    selector: 'app-birth-mark-letter-nepali',
    templateUrl: './birth-mark-letter-nepali.component.html',
    styleUrls: ['./birth-mark-letter-nepali.component.scss']
})
export class BirthMarkLetterNepaliComponent implements OnInit {
    show = false;
    form: FormGroup;
    @Input() loanDataHolder: LoanDataHolder;
    customerOfferLetter: CustomerOfferLetter;
    @Input() customerId: number;
    offerLetterTypeId = 1;  // 1 represents Birth Mark Letter
    existingOfferLetter = false;
    spinner = false;
    initialInfoPrint;

    constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private customerOfferLetterService: CustomerOfferLetterService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.fillForm();
    }

    buildForm(): void {
        this.form = this.formBuilder.group({
            date: [undefined],
            applicantName: [undefined],
            applicantPermanentAddress: [undefined],
            applicantPresentAddress: [undefined],
            applicantAge: [undefined],
            applicantCitizenshipNumber: [undefined],
            applicantCitizenshipIssuedPlace: [undefined],
            applicantCitizenshipIssuedDate: [undefined],
            applicantMobileNumber: [undefined],
            loanType: [undefined],
            applicantRelativeOne: [undefined],
            applicantRelativeOneRelation: [undefined],
            applicantRelativeTwo: [undefined],
            applicantRelativeTwoRelation: [undefined],
            totalApplicantCount: [undefined],
            amountLimit: [undefined],
            amountLimitWord: [undefined],
            interestRate: [undefined],
            interestAmount: [undefined],
            interestWord: [undefined],
            securityGuarantorFirst: this.formBuilder.group({
                name: [undefined],
                district: [undefined],
                address: [undefined],
                stockQuantity: [undefined],
                landArea: [undefined]
            }),
            securityGuarantorRemaining: this.formBuilder.array([]),
            securityRemaining: this.formBuilder.group({
                securityRemaining1Amount: [undefined],
                securityRemaining1Word: [undefined],
                securityRemaining2Amount: [undefined],
                securityRemaining2Word: [undefined],
                securityRemaining3Amount: [undefined],
                securityRemaining3Word: [undefined]
            })
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
            (this.form.get('securityGuarantorRemaining') as FormArray).push(this.securityGuarantorRemainingFormGroup(null));
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
                initialInfo.securityGuarantorRemaining.forEach(info => {
                    (this.form.get('securityGuarantorRemaining') as FormArray).push(
                        this.securityGuarantorRemainingFormGroup(
                            {
                                name: info.name,
                                amount: info.amount,
                                amountInWords: info.amountInWords
                            }
                        )
                    );
                });
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
            });
        }
        this.form.valueChanges.subscribe((value) => {
            this.form.patchValue(value, {emitEvent: false});
        });
    }

    securityGuarantorRemainingFormGroup(info): FormGroup {
        return this.formBuilder.group({
            name: [ObjectUtil.isEmpty(info) ? undefined : info.name],
            amount: [ObjectUtil.isEmpty(info) ? undefined : info.amount],
            amountInWords: [ObjectUtil.isEmpty(info) ? undefined : info.amountInWords]
        });
    }

    addGuarantor(): void {
        (this.form.get('securityGuarantorRemaining') as FormArray).push(this.securityGuarantorRemainingFormGroup(null));
    }

    removeGuarantor(deleteIndex: number): void {
        (this.form.get('securityGuarantorRemaining') as FormArray).removeAt(deleteIndex);
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
                    this.router.navigate(['/home/cad-document'], {
                        queryParams: {customerId: this.customerId, }
                    });
                }
            });
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Birth Mark Offer Letter'));
            this.spinner = false;
        });
    }

}
