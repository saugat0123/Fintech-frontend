import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliNumberPipe} from '../../../../../../@core/pipe/nepali-number.pipe';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
    selector: 'app-hypothecation-over-stock-and-receivable-current-assets',
    templateUrl: './hypothecation-over-stock-and-receivable-current-assets.component.html',
    styleUrls: ['./hypothecation-over-stock-and-receivable-current-assets.component.scss']
})
export class HypothecationOverStockAndReceivableCurrentAssetsComponent implements OnInit {

    @Input() customerLoanId;
    @Input() cadData;
    @Input() documentId;
    form: FormGroup;
    initialInfoPrint;
    spinner = false;
    offerLetterConst = CadCheckListTemplateEnum;
    amount;
    nepaliData;
    customerInfo;
    stock;

    constructor(
        private formBuilder: FormBuilder,
        private administrationService: CreditAdministrationService,
        private toastService: ToastService,
        private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
        private routerUtilsService: RouterUtilsService,
        private currencyFormatPipe: CurrencyFormatterPipe,
        private engToNepNumberPipe: EngToNepaliNumberPipe,
        private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
        private nepaliToEnglishPipe: NepaliToEngNumberPipe,
        private nepaliNumber: NepaliNumberPipe,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.amount = this.cadData.assignedLoan[0].proposal.proposedLimit;
        this.customerInfo = this.cadData.assignedLoan[0].customerInfo;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    this.initialInfoPrint = singleCadFile.initialInformation;
                    if (!ObjectUtil.isEmpty(JSON.parse(singleCadFile.initialInformation).proposedAmount)) {
                        this.amount = JSON.parse(singleCadFile.initialInformation).proposedAmount;
                    }
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        this.checkStockAndReceivable();
        this.checkInitialData();
        if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
            this.form.patchValue(JSON.parse(this.initialInfoPrint));
            this.form.patchValue({
                branchDistrict: this.nepaliData.branchDetail ? this.nepaliData.branchDetail.branchDistrict : '',
                branchMun: this.nepaliData.branchDetail ? this.nepaliData.branchDetail.branchMunVdc : '',
                branchWardNo: this.nepaliData.branchDetail ? this.nepaliData.branchDetail.branchWardNo : '',
                branchName: this.nepaliData.branchDetail ? this.nepaliData.branchDetail.branchNameInNepali : '',
                companyName: this.nepaliData.nepaliName ? this.nepaliData.nepaliName : '',
                companyRegistrationNo: this.nepaliData.registrationNo ? this.nepaliData.registrationNo : '',
                companyPanNumber: this.nepaliData.panNo ? this.nepaliData.panNo : '',
                registrationNikayaName: this.nepaliData.companyRegOffice ? this.nepaliData.companyRegOffice : '',
                registrationDate: this.nepaliData.regIssueDate ? this.nepaliData.regIssueDate : '',
                companyPanIssueOffice: this.nepaliData.panIssueOffice ? this.nepaliData.panIssueOffice : '',
                companyPanIssueDate: this.nepaliData.panIssueDate ? this.nepaliData.panIssueDate : '',
                companyRegDistrict: this.nepaliData.institutionRegisteredAddress ? this.nepaliData.institutionRegisteredAddress.district : '',
                companyRegVdc: this.nepaliData.institutionRegisteredAddress ? this.nepaliData.institutionRegisteredAddress.municipality : '',
                companyRegWardNo: this.nepaliData.institutionRegisteredAddress ? this.nepaliData.institutionRegisteredAddress.wardNo : '',
                companyRegTole: this.nepaliData.institutionRegisteredAddress ? this.nepaliData.institutionRegisteredAddress.tole : '',
                companyRepresentativeName: this.nepaliData.authorizedPersonDetail ? this.nepaliData.authorizedPersonDetail.name : '',
                companyRepresentativeGrandFatherName: this.nepaliData.authorizedPersonDetail ? this.nepaliData.authorizedPersonDetail.grandFatherName : '',
                companyRepresentativeFatherName: this.nepaliData.authorizedPersonDetail ? this.nepaliData.authorizedPersonDetail.fatherName : '',
          //      companyRepresentativeHusbandName: this.nepaliData.authorizedPersonDetail ? ObjectUtil.setUndefinedIfNull(this.nepaliData.authorizedPersonDetail.husbandName) : '',
                companyRepresentativeDistrict: this.nepaliData.authorizedPersonAddress ? this.nepaliData.authorizedPersonAddress.district : '',
                companyRepresentativeVdc: this.nepaliData.authorizedPersonAddress ? this.nepaliData.authorizedPersonAddress.municipality : '',
                companyRepresentativeWardNo: this.nepaliData.authorizedPersonAddress ? this.nepaliData.authorizedPersonAddress.wardNo : '',
                representativeCitizenNumber: this.nepaliData.authorizedPersonDetail ? this.nepaliData.authorizedPersonDetail.citizenshipNo : '',
                representativeCitizenIssueDate: this.nepaliData.authorizedPersonDetail ? this.nepaliData.authorizedPersonDetail.citizenshipIssueDate : '',
                representativeCitizenOffice: this.nepaliData.authorizedPersonDetail ? this.nepaliData.authorizedPersonDetail.citizenshipIssueDistrict : '',
                stockValue: this.stock ? this.stock.stocksReceivablesValue.stockValue : '',
                debtValue: this.stock ? this.stock.stocksReceivablesValue.receivableValue : '',
                proposedAmount: this.nepaliNumber.transform(this.amount, 'preeti'),
                amountInWords: this.nepaliCurrencyWordPipe.transform(this.amount)
            });
        } else {
            this.patchForm();
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            office: [undefined],
            issuedOffice: [undefined],
            registrationNumber: [undefined],
            issuedDate: [undefined],
            issuedDistrict: [undefined],
            issuedMunicipality: [undefined],
            issuedWadNo: [undefined],
            taxOffice: [undefined],
            taxNo: [undefined],
            issuedYear: [undefined],
            issuedMonth: [undefined],
            issuedDay: [undefined],
            name: [undefined],
            guarantorGrandFatherName: [undefined],
            guarantorFatherName: [undefined],
            guarantorHusbandName: [undefined],
            guarantorDistrict: [undefined],
            guarantorMunicipality: [undefined],
            guarantorWadNo: [undefined],
            guarantorCurrentAddress: [undefined],
            guarantorAge: [undefined],
            guarantorName: [undefined],
            guarantorCitizenshipNo: [undefined],
            guarantorCitizenshipIssuedOffice: [undefined],
            guarantorIssuedYear: [undefined],
            guarantorIssuedMonth: [undefined],
            guarantorIssuedDay: [undefined],
            proposedAmount: [undefined],
            amountInWords: [undefined],
            role: [undefined],
            roleName: [undefined],
            itiSambatYear: [undefined],
            itiSambatMonth: [undefined],
            itiSambatDay: [undefined],
            roj: [undefined],
            districtOne: [undefined],
            municipalityOne: [undefined],
            wardNum: [undefined],
            ageOne: [undefined],
            sakshiName: [undefined],
            districtTwo: [undefined],
            municipalityTwo: [undefined],
            wardNumTwo: [undefined],
            ageTwo: [undefined],
            sakshiNameTwo: [undefined],
            branchDistrict: [undefined],
            branchMun: [undefined],
            branchWardNo: [undefined],
            branchName: [undefined],
            companyName: [undefined],
            companyRegistrationNo: [undefined],
            companyPanNumber: [undefined],
            registrationNikayaName: [undefined],
            registrationDate: [undefined],
            companyPanIssueOffice: [undefined],
            companyPanIssueDate: [undefined],
            companyRegDistrict: [undefined],
            companyRegVdc: [undefined],
            companyRegWardNo: [undefined],
            companyRegTole: [undefined],
            companyRepresentativeName: [undefined],
            companyRepresentativeAge: [undefined],
            companyRepresentativeGrandFatherName: [undefined],
            companyRepresentativeFatherName: [undefined],
            // companyRepresentativeHusbandName: [undefined],
            companyRepresentativeDistrict: [undefined],
            companyRepresentativeVdc: [undefined],
            companyRepresentativeWardNo: [undefined],
            representativeCitizenNumber: [undefined],
            representativeCitizenIssueDate: [undefined],
            representativeCitizenOffice: [undefined],
            stockValue: [undefined],
            debtValue: [undefined],
        });
    }
patchForm() {
    if (!ObjectUtil.isEmpty(this.nepaliData)) {
        this.form.patchValue({
            branchDistrict: ObjectUtil.setUndefinedIfNull(this.nepaliData.branchDetail.branchDistrict),
            branchMun: this.nepaliData.branchDetail.branchMunVdc,
            branchWardNo: this.nepaliData.branchDetail.branchWardNo,
            branchName: this.nepaliData.branchDetail.branchNameInNepali,
            companyName: ObjectUtil.setUndefinedIfNull(this.nepaliData.nepaliName),
            companyRegistrationNo: this.nepaliData.registrationNo,
            companyPanNumber: this.nepaliData.panNo,
            registrationNikayaName: this.nepaliData.companyRegOffice,
            registrationDate: this.nepaliData.regIssueDate,
            companyPanIssueOffice: this.nepaliData.panIssueOffice,
            companyPanIssueDate: this.nepaliData.panIssueDate,
            companyRegDistrict: this.nepaliData.institutionRegisteredAddress.district,
            companyRegVdc: this.nepaliData.institutionRegisteredAddress.municipality,
            companyRegWardNo: this.nepaliData.institutionRegisteredAddress.wardNo,
            companyRegTole: this.nepaliData.institutionRegisteredAddress.tole,
            companyRepresentativeName: this.nepaliData.authorizedPersonDetail.name,
            companyRepresentativeGrandFatherName: this.nepaliData.authorizedPersonDetail.grandFatherName,
            companyRepresentativeFatherName: this.nepaliData.authorizedPersonDetail.fatherName,
            // companyRepresentativeHusbandName: ObjectUtil.setUndefinedIfNull(this.nepaliData.authorizedPersonDetail.husbandName),
            companyRepresentativeDistrict: this.nepaliData.authorizedPersonAddress.district,
            companyRepresentativeVdc: this.nepaliData.authorizedPersonAddress.municipality,
            companyRepresentativeWardNo: this.nepaliData.authorizedPersonAddress.wardNo,
            representativeCitizenNumber: this.nepaliData.authorizedPersonDetail.citizenshipNo,
            representativeCitizenIssueDate: this.nepaliData.authorizedPersonDetail.citizenshipIssueDate,
            representativeCitizenOffice: this.nepaliData.authorizedPersonDetail.citizenshipIssueDistrict,
            stockValue: this.stock ? this.stock.stocksReceivablesValue.stockValue : '',
            debtValue: this.stock ? this.stock.stocksReceivablesValue.receivableValue : '',
        });
    }
}

    onSubmit() {
        this.spinner = true;
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.form.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.form.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.form.value);
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved'));
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
            this.spinner = false;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save'));
            this.dialogRef.close();
            this.spinner = false;
        });
    }

    checkInitialData() {
        if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
            this.form.patchValue(JSON.parse(this.initialInfoPrint));
            this.form.patchValue({
                amountInWords: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(this.amount))
            });
        } else {
            this.form.patchValue({
                proposedAmount: this.nepaliNumber.transform(this.amount, 'preeti'),
                amountInWords: this.nepaliCurrencyWordPipe.transform(this.amount)
            });
        }
    }

    checkStockAndReceivable() {
        if (this.nepaliData.collateralDetails.length > 0) {
            this.nepaliData.collateralDetails.forEach((val, i) => {
                if (!ObjectUtil.isEmpty(val.collateralType)) {
                    if (val.collateralType === 'stocks_receivables') {
                        this.stock = val;
                        return;
                    }
                }
            });
        }
    }
  con(e) {
    this.form.patchValue({
      amountInWords: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(e.target.value))
    });
  }

}
