import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {LegalDocumentCheckListEnum} from '../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
    selector: 'app-margin-call-deed-share-loan',
    templateUrl: './margin-call-deed-share-loan.component.html',
    styleUrls: ['./margin-call-deed-share-loan.component.scss']
})
export class MarginCallDeedShareLoanComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    @Input() nepaliAmount: NepaliNumberAndWords;

    marginShareLoan: FormGroup;
    spinner;
    offerLetterConst = LegalDocumentCheckListEnum;
    initialInfoPrint;
    existingOfferLetter = false;
    customGender;
    nepData;

    constructor(private fromBuilder: FormBuilder,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private toastService: ToastService,
                private administrationService: CreditAdministrationService,
                private routerUtilsService: RouterUtilsService,
                private nepPercentWordPipe: NepaliPercentWordPipe,
                private dialogRef: NbDialogRef<MarginCallDeedShareLoanComponent>) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetter();
    }

    buildForm() {
        this.marginShareLoan = this.fromBuilder.group({
            shareLoan: [undefined],
            shareLoanWords: [undefined],
            grandFatherName: [undefined],
            fatherName: [undefined],
            zoneName: [undefined],
            districtName: [undefined],
            municipalityOrVdc: [undefined],
            wardNo: [undefined],
            tempZone: [undefined],
            tempDistrict: [undefined],
            tempMunicipalityOrVdc: [undefined],
            tempWardNo: [undefined],
            borrowerAge: [undefined],
            borrowerName: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            interestRate: [undefined],
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
        this.marginShareLoan.patchValue({
            grandFatherName: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
            fatherName: this.nepData.fatherName ? this.nepData.fatherName : '',
            zoneName: [undefined],
            districtName: this.nepData.permanentDistrict ? this.nepData.permanentDistrict : '',
            municipalityOrVdc: this.nepData.permanentMunicipality ? this.nepData.permanentMunicipality : '',
            wardNo: this.nepData.permanentWard ? this.nepData.permanentWard : '',
            tempZone: [undefined],
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
                        this.marginShareLoan.patchValue(this.initialInfoPrint);
                    } else {
                        this.fillForm();
                    }
                });
            } else {
                if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
                    this.fillForm();
                }
            }
        }
    }

    submit() {
        console.log(this.marginShareLoan.value);
        this.spinner = true;
        let flag = true;

        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.marginShareLoan.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.marginShareLoan.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.marginShareLoan.value);
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
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        });
    }

    convertAmountInWords(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.marginShareLoan.get(numLabel).value);
        const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.marginShareLoan.get(wordLabel).patchValue(convertedVal);
    }

}
