import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../model/OfferDocument';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';

@Component({
    selector: 'app-retail-educational-loan-english',
    templateUrl: './retail-educational-loan-english.component.html',
    styleUrls: ['./retail-educational-loan-english.component.scss']
})
export class RetailEducationalLoanEnglishComponent implements OnInit {
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
                private routerUtilsService: RouterUtilsService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetterData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            referenceNo: [undefined],
            referenceNo1: [undefined],
            date: [undefined],
            date1: [undefined],
            date2: [undefined],
            FdDate: [undefined],
            guarantor: [undefined],
            educationalLoan: [undefined],
            educationLoanInWord: [undefined],
            purpose: [undefined],
            studyLocation: [undefined],
            applicantName: [undefined],
            promissory: [undefined],
            loanDeed: [undefined],
            morgage: [undefined],
            personalGuarantee: [undefined],
            month: [undefined],
            returnmonth: [undefined],
            installment: [undefined],
            installmentInWord: [undefined],
            contactNo: [undefined],
            gPermanentDistrict: [undefined],
            gCurrentDistrict: [undefined],
            gPermanentWardNo: [undefined],
            gCurrentWardNo: [undefined],
            gPermanentVdc: [undefined],
            gCurrentMunicipality: [undefined],
            gContactNo: [undefined],
            gEmailId: [undefined],
            sDistrict: [undefined],
            sWardNo: [undefined],
            sVdc: [undefined],
            sPlotNo: [undefined],
            sArea: [undefined],
            sFmvNpr: [undefined],
            sFmvNprInWord: [undefined],
            sValuatorName: [undefined],
            accountNo: [undefined],
            fdEmi: [undefined],
            fdDate: [undefined],
            fdPercentage: [undefined],
            fdBrPercentage: [undefined],
            fdRs: [undefined],
            fdRsInWord: [undefined],
            aName: [undefined],
            foaName: [undefined],
            doaName: [undefined],
            borrowerName: [undefined],
            ccbName: [undefined],
            name1: [undefined],
            permanentDistrict1: [undefined],
            currentDistrict1: [undefined],
            permanentWardNo1: [undefined],
            currentWardNo1: [undefined],
            permanentVdc1: [undefined],
            currentMunicipality1: [undefined],
            emailId1: [undefined],
            contactNo1: [undefined],
            borrowerPermanentDistrict: [undefined],
            borrowerCurrentDistrict: [undefined],
            borrowerPermanentWardNo: [undefined],
            borrowerCurrentWardNo: [undefined],
            borrowerPermanentVdc: [undefined],
            borrowerCurrentMunicipality: [undefined],
            borrowerEmailId: [undefined],
            borrowerContactNo: [undefined],
            ccbPermanentDistrict: [undefined],
            ccbCurrentDistrict: [undefined],
            ccbPermanentWardNo: [undefined],
            ccbCurrentWardNo: [undefined],
            ccbPermanentVdc: [undefined],
            ccbCurrentMunicipality: [undefined],
            ccbEmailId: [undefined],
            ccbContactNo: [undefined],
            course: [undefined],
            fcPercentage: [undefined],
            reviewYears: [undefined],
            scAccountNo: [undefined],
            scAccountNo1: [undefined],

        });
    }

    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.RETAIL_EDUCATIONAL_ENGLISH).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_EDUCATIONAL_ENGLISH);
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
                if (offerLetterPath.docName.toString() === this.offerLetterConst.
                value(this.offerLetterConst.RETAIL_EDUCATIONAL_ENGLISH).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_EDUCATIONAL_ENGLISH);
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
