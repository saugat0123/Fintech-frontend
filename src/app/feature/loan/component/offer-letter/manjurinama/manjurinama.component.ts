import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';
import {Alert, AlertType} from "../../../../../@theme/model/Alert";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {DocStatus} from "../../../model/docStatus";
import {OfferLetter} from "../../../../admin/modal/offerLetter";
import {CustomerOfferLetterPath} from "../../../model/customer-offer-letter-path";
import {CustomerOfferLetterService} from "../../../service/customer-offer-letter.service";
import {ToastService} from "../../../../../@core/utils";
import {Router} from "@angular/router";

@Component({
    selector: 'app-manjurinama',
    templateUrl: './manjurinama.component.html',
    styleUrls: ['./manjurinama.component.scss']
})
export class ManjurinamaComponent implements OnInit {

    show = false;
    formgroup: FormGroup;
    @Input() loanDataHolder: LoanDataHolder;
    customerOfferLetter: CustomerOfferLetter;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;
    existingOfferLetter = false;
    spinner = false;
    initialInfoPrint;

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
    buildForm(): void {
        this.formgroup = this.formBuilder.group({
            vehicleOwnerName: [undefined],
            loanee: [undefined],
            vehicleNo: [undefined],
            district: [undefined],
            vdcMunicipality: [undefined],
            wardNo: [undefined],
            grandFatherName: [undefined],
            fatherName: [undefined],
            age: [undefined],
            administrationAddress: [undefined],
            date: [undefined],
            citizenshipNo: [undefined],
            name1: [undefined],
            ministry: [undefined],
            bibhag: [undefined],
            karyalaya: [undefined],
            dartaDate: [undefined],
            dartaNo: [undefined],
            districtName: [undefined],
            vdcMunicipalityName: [undefined],
            wardNumber: [undefined],
            loaneeName: [undefined],
            reason: [undefined],
            manjuriDate: [undefined],
            manjurinamaGiverName: [undefined],
            manjurinamaGiverAddress: [undefined],
            year: [undefined],
            month: [undefined],
            time: [undefined],
            details: [undefined],
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
                this.formgroup.patchValue(initialInfo, {emitEvent: false});

            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
            });
        }
        this.formgroup.valueChanges.subscribe((value) => {
            this.formgroup.patchValue(value, {emitEvent: false});
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
                    offerLetterPath.initialInformation = JSON.stringify(this.formgroup.value);
                }
            });
        } else {
            const offerLetter = new OfferLetter();
            offerLetter.id = this.offerLetterTypeId;
            const customerOfferLetterPathArray = this.customerOfferLetter.customerOfferLetterPath ?
                this.customerOfferLetter.customerOfferLetterPath : [];
            const customerOfferLetterPath = new CustomerOfferLetterPath();
            customerOfferLetterPath.offerLetter = offerLetter;
            customerOfferLetterPath.initialInformation = JSON.stringify(this.formgroup.value);
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
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Birth Mark Offer Letter'));
            this.spinner = false;
        });
    }

}
