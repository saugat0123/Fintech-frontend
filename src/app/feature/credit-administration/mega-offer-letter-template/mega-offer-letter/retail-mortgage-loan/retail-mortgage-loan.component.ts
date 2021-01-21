import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Router} from '@angular/router';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {ToastService} from '../../../../../@core/utils';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {RouterUtilsService} from '../../../utils/router-utils.service';

@Component({
    selector: 'app-retail-mortgage-loan',
    templateUrl: './retail-mortgage-loan.component.html',
    styleUrls: ['./retail-mortgage-loan.component.scss']
})
export class RetailMortgageLoanComponent implements OnInit {
    form: FormGroup;
    // todo replace enum constant string compare
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    offerLetterDocument: OfferDocument;

    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private customerOfferLetterService: CustomerOfferLetterService,
                private toastService: ToastService,
                private administrationService: CreditAdministrationService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetterData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            date: [undefined],
            refNo: [undefined],
            customerName: [undefined],
            permanentAddress: [undefined],
            currentAddress: [undefined],
            mobileNo: [undefined],
            subject: [undefined],
            loanName: [undefined],
            loanAmount: [undefined],
            loanNameInWord: [undefined],

            companyLocation: [undefined],
            companyName: [undefined],
            course: [undefined],
            loanTenure: [undefined],
            moratoriumPeriod: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyLoanRate: [undefined],
            emiPeriod: [undefined],
            emiAmount: [undefined],
            emiAmountInWord: [undefined],
            fmvPercent: [undefined],
            serviceChargePercent: [undefined],
            draftAmount: [undefined],
            securityPersonName: [undefined],
            motherDistrict: [undefined],
            motherWardNo: [undefined],
            securityDistrict: [undefined],
            securityWardNo: [undefined],
            securityLandId: [undefined],
            loanManagingDirectorName: [undefined],
            loanManagerName: [undefined],
            guarantors: [undefined],
            security: this.formBuilder.array([])
        });
    }

    addSecurity() {
        (this.form.get('security') as FormArray).push(this.formBuilder.group({
            securityDetail: [undefined],
            securityAmount: [undefined],
            riskCoverage: [undefined]
        }));
    }

    removeSecurity(deleteIndex: number): void {
        (this.form.get('security') as FormArray).removeAt(deleteIndex);
    }

    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_LOAN).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_LOAN);
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                console.log(initialInfo);
                this.initialInfoPrint = initialInfo;
                console.log(this.offerLetterDocument);
                this.existingOfferLetter = true;
                this.form.patchValue(initialInfo, {emitEvent: false});
                this.initialInfoPrint = initialInfo;
            }
        }
    }


    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_LOAN).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_LOAN);
            offerDocument.initialInformation = JSON.stringify(this.form.value);
            this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
        }

        this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        });

    }
}
