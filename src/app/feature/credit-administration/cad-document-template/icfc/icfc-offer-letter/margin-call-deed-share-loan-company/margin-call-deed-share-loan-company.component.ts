import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../../@core/utils';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {LegalDocumentCheckListEnum} from '../../legalDocumentCheckListEnum';

@Component({
    selector: 'app-margin-call-deed-share-loan-company',
    templateUrl: './margin-call-deed-share-loan-company.component.html',
    styleUrls: ['./margin-call-deed-share-loan-company.component.scss']
})
export class MarginCallDeedShareLoanCompanyComponent implements OnInit {

    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    @Input() nepaliAmount: NepaliNumberAndWords;

    shareLoanCompany: FormGroup;
    spinner;
    offerLetterConst = LegalDocumentCheckListEnum;
    initialInfoPrint;
    nepData;

    constructor(private formBuilder: FormBuilder,
                private toastService: ToastService,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private administrationService: CreditAdministrationService,
                private routerUtilsService: RouterUtilsService,
                private customerOfferLetterService: CustomerOfferLetterService,
                private dialogRef: NbDialogRef<MarginCallDeedShareLoanCompanyComponent>) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetter();
    }

    buildForm() {
        this.shareLoanCompany = this.formBuilder.group({
            shareLoan: [undefined],
            shareLoanWords: [undefined],
            governmentOfficeName: [undefined],
            governmentOfficeAddress: [undefined],
            registrationNo: [undefined],
            registeredDate: [undefined],
            province: [undefined],
            zoneName: [undefined],
            districtName: [undefined],
            municipalityOrVdc: [undefined],
            wardNo: [undefined],
            panNo: [undefined],
            orgOwnerName: [undefined],
            grandfatherName: [undefined],
            fatherName: [undefined],
            borrowerProvince: [undefined],
            borrowerZone: [undefined],
            borrowerDistrict: [undefined],
            borrowerVdcOrMunicipality: [undefined],
            borrowerWardNo: [undefined],
            tempProvince: [undefined],
            tempZone: [undefined],
            tempDistrict: [undefined],
            tempMunicipalityOrVdc: [undefined],
            tempWardNo: [undefined],
            borrowerAge: [undefined],
            borrowerName: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            interestRate: [undefined],
            interestAmount: [undefined],
            serviceRate: [undefined],
            repaymentPeriod: [undefined],
            duration: [undefined],
            loanValueRate: [undefined],
            debtFlowRate: [undefined],
            singedYear: [undefined],
            signedMonth: [undefined],
            singedDate: [undefined],
            singedDay: [undefined],
            docWrittenYear: [undefined],
            docWrittenMonth: [undefined],
            docWrittenDate: [undefined],
            docWrittenDay: [undefined],
            subham: [undefined],
        });
    }

    fillForm() {
        this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
        // Checking the data:
        console.log(this.nepData);
        this.shareLoanCompany.patchValue({
            grandfatherName: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
            fatherName: this.nepData.fatherName ? this.nepData.fatherName : '',
            borrowerProvince: this.nepData.permanentProvince ? this.nepData.permanentProvince : '',
            borrowerDistrict: this.nepData.permanentDistrict ? this.nepData.permanentDistrict : '',
            borrowerVdcOrMunicipality: this.nepData.permanentMunicipality ? this.nepData.permanentMunicipality : '',
            borrowerWardNo: this.nepData.permanentWard ? this.nepData.permanentWard : '',
            tempProvince: this.nepData.temporaryProvince ? this.nepData.temporaryProvince : '',
            tempDistrict: this.nepData.temporaryDistrict ? this.nepData.temporaryDistrict : '',
            tempMunicipalityOrVdc: this.nepData.temporaryMunicipality ? this.nepData.temporaryMunicipality : '',
            tempWardNo: this.nepData.temporaryWard ? this.nepData.temporaryWard : '',
            borrowerAge: this.nepData.age ? this.nepData.age : '',
            borrowerName: this.nepData.name ? this.nepData.name : '',
        });
    }

    checkOfferLetter() {
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            if (this.cadData.cadFileList.length > 0) {
                this.cadData.cadFileList.forEach(singleCadFile => {
                    console.log(singleCadFile);
                    if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                        const initialInfo = JSON.parse(singleCadFile.initialInformation);
                        this.initialInfoPrint = initialInfo;
                        this.shareLoanCompany.patchValue(this.initialInfoPrint);
                    } else {
                        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
                            this.fillForm();
                        }
                    }
                });
            } else {
                this.fillForm();
            }
        }
    }


    submit() {
        console.log(this.shareLoanCompany.value);
        this.spinner = true;
        let flag = true;

        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.shareLoanCompany.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.shareLoanCompany.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.shareLoanCompany.value);
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.DANGER, 'Failed to save offer letter !'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        });
    }

    convertAmountInWords(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.shareLoanCompany.get(numLabel).value);
        const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.shareLoanCompany.get(wordLabel).patchValue(convertedVal);
    }


}
