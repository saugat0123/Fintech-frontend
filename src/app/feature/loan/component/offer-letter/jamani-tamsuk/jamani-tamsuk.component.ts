import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../@core/utils';
import {CustomerOfferLetterService} from '../../../service/customer-offer-letter.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Router} from '@angular/router';
import {DocStatus} from '../../../model/docStatus';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {CustomerOfferLetterPath} from '../../../model/customer-offer-letter-path';

@Component({
    selector: 'app-jamani-tamsuk',
    templateUrl: './jamani-tamsuk.component.html',
    styleUrls: ['./jamani-tamsuk.component.scss']
})
export class JamaniTamsukComponent implements OnInit {
    form: FormGroup;
    spinner = false;
    @Input() loanDataHolder: LoanDataHolder;
    customerOfferLetter: CustomerOfferLetter;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;
    existingOfferLetter = false;
    initialInfoPrint;
    info;
    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private customerOfferLetterService: CustomerOfferLetterService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.formBuild();
        this.fillForm();
    }

    formBuild() {
        this.form = this.formBuilder.group({
            ward: [undefined],
            district: [undefined],
            family: [undefined],
            approve: [undefined],
            applicantName: [undefined],
            applicantPermanentAddress: [undefined],
            applicantPresentAddress: [undefined],
            applicantRelative: [undefined],
            applicantFamily: [undefined],
            date: [undefined],
            governmentOfNepal: [undefined],
            minister: [undefined],
            department: [undefined],
            registrationNo: [undefined],
            year: [undefined],
            applicantRelativeTwo: [undefined],
            municipalityCerifiedNumber: [undefined],
            price: [undefined],
            letter: [undefined],
            districtDate: [undefined],
            districtOffice: [undefined],
            location: [undefined],
            name: [undefined]
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
                    this.form.patchValue(initialInfo, {emitEvent: false});
                }, error => {
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
                });
        }
        this.form.valueChanges.subscribe((value) => {
            this.form.patchValue(value, {emitEvent: false});
        });
    }

    submit(): void {
        this.spinner = true;
        this.info = this.form.value;
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
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Jamani Tamsuk Offer Letter'));
            this.spinner = false;
        });

    }
}
