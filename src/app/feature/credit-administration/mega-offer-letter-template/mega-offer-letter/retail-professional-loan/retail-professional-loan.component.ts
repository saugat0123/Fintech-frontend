import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';

@Component({
    selector: 'app-retail-professional-loan',
    templateUrl: './retail-professional-loan.component.html',
    styleUrls: ['./retail-professional-loan.component.scss']
})
export class RetailProfessionalLoanComponent implements OnInit {
    retailProfessionalLoan: FormGroup;
    // todo replace enum constant string compare
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    offerLetterDocument: OfferDocument;

    selectedArray = [];
    loanTypeArray = ['Professional Term Loan', 'Professional Overdraft Loan' ];
    proTermLoanSelected = false;
    proOverdraftLoanSelected = false;

    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    ckeConfig = NepaliEditor.CK_CONFIG;

    constructor(private formBuilder: FormBuilder,
                private customerOfferLetterService: CustomerOfferLetterService,
                private toastService: ToastService,
                private router: Router,
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
        this.retailProfessionalLoan = this.formBuilder.group({
            refNo: [undefined],
            borrowerName: [undefined],
            loanAmount: [undefined],
            borrowerAddress: [undefined],
            contactNumber: [undefined],
            timePeriod: [undefined],
            gurantorName: [undefined],
            gurantorNameFlag: [true],
            loanOfficer1: [undefined],
            loanOfficer2: [undefined],
            date: [undefined],

            loanTypeSelectedArray: [undefined],

            karjaFirstLine: [undefined],
            clausesTextEditor: [undefined],
            pageCount: [undefined],
            professionalTermLoanArray: this.formBuilder.array([this.buildProfessionalTermLoanGroup()]),
            professionalOverDraftLoanArray: this.formBuilder.array([this.buildProfessionalOverDraftLoanGroup()]),
        });
    }

    buildProfessionalTermLoanGroup() {
        return this.formBuilder.group({
            karjaSeemaRakam: [undefined],
            karjaSeemaRakamWord: [undefined],
            prayojan: [undefined],
            tenure: [undefined],
            rate: [undefined],
            aadharRate: [undefined],
            premiumRate: [undefined],
            reenChuktaDate: [undefined],
            reenChuktaMaasik: [undefined],
            noOfInstallments: [undefined],
            emiAmount: [undefined],
            amountInWords: [undefined],
            sewaSulka: [undefined],
            chargeAmount: [undefined],
            chargeAmountFlag: [true],
        });
    }

    buildProfessionalOverDraftLoanGroup() {
        return this.formBuilder.group({
            karjaSeemaRakam: [undefined],
            karjaSeemaRakamWord: [undefined],
            prayojan: [undefined],
            tenure: [undefined],
            rate: [undefined],
            aadharRate: [undefined],
            premiumRate: [undefined],
            sewaSulka: [undefined],
            chargeAmount: [undefined],
            chargeAmountFlag: [true],
        });
    }

    changeLoanType($event) {
        this.selectedArray = $event;
        $event.includes('Professional Term Loan') ? this.proTermLoanSelected = true : this.proTermLoanSelected = false;
        $event.includes('Professional Overdraft Loan') ? this.proOverdraftLoanSelected = true : this.proOverdraftLoanSelected = false;
    }

    addMoreProfessionalOverDraftLoan() {
        (this.retailProfessionalLoan.get('professionalOverDraftLoanArray') as FormArray).push(this.buildProfessionalOverDraftLoanGroup());
    }

    addMoreProfessionalTermLoan() {
        (this.retailProfessionalLoan.get('professionalTermLoanArray') as FormArray).push(this.buildProfessionalTermLoanGroup());
    }

    removeProfessionalOverDraftLoan(i) {
        (this.retailProfessionalLoan.get('professionalOverDraftLoanArray') as FormArray).removeAt(i);
    }

    removeProfessionalTermLoan(i) {
        (this.retailProfessionalLoan.get('professionalTermLoanArray') as FormArray).removeAt(i);
    }

    removeOptionalField(formGroup, fieldControlName) {
        formGroup.get(fieldControlName).patchValue(false);
    }

    undoRemovalOfOptionalField(formGroup, fieldControlName) {
        formGroup.get(fieldControlName).patchValue(true);
    }

    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.RETAIL_PROFESSIONAL_LOAN).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_PROFESSIONAL_LOAN);
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                this.initialInfoPrint = initialInfo;
                this.existingOfferLetter = true;
                this.retailProfessionalLoan.patchValue(initialInfo, {emitEvent: false});

                this.selectedArray = initialInfo.loanTypeSelectedArray;
                this.changeLoanType(this.selectedArray);
                (this.retailProfessionalLoan.get('professionalTermLoanArray') as FormArray).clear();
                initialInfo.professionalTermLoanArray.forEach( value => {
                    (this.retailProfessionalLoan.get('professionalTermLoanArray') as FormArray).push(this.formBuilder.group(value));
                });
                (this.retailProfessionalLoan.get('professionalOverDraftLoanArray') as FormArray).clear();
                initialInfo.professionalOverDraftLoanArray.forEach( value => {
                    (this.retailProfessionalLoan.get('professionalOverDraftLoanArray') as FormArray).push(this.formBuilder.group(value));
                });
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
                    this.offerLetterConst.value(this.offerLetterConst.RETAIL_PROFESSIONAL_LOAN).toString()) {
                    this.retailProfessionalLoan.get('loanTypeSelectedArray').patchValue(this.selectedArray);
                    offerLetterPath.initialInformation = JSON.stringify(this.retailProfessionalLoan.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_PROFESSIONAL_LOAN);
            this.retailProfessionalLoan.get('loanTypeSelectedArray').patchValue(this.selectedArray);
            offerDocument.initialInformation = JSON.stringify(this.retailProfessionalLoan.value);
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
