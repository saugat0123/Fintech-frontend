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
            this.patchForm();
        }
        this.checkInitialData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            customerName: [undefined],
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
            registrationNikayaName: [undefined],
            registrationDate: [undefined],
            companyPanNumber: [undefined],
            companyPanIssueOffice: [undefined],
            companyPanIssueDate: [undefined],
            companyRegDistrict: [undefined],
            companyRegVdc: [undefined],
            companyRegWardNo: [undefined],
            companyRegTole: [undefined],
            companyRegTempDistrict: [undefined],
            companyRegTempVdc: [undefined],
            companyRegTempWardNo: [undefined],
            companyRegTempTole: [undefined],
            companyRepresentativeName: [undefined],
            companyRepresentativeGrandFatherName: [undefined],
            companyRepresentativeFatherName: [undefined],
            companyRepresentativeHusbandName: [undefined],
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
        this.form.patchValue({
            branchDistrict: ObjectUtil.setUndefinedIfNull(this.nepaliData.branchDetail.branchDistrict),
            branchMun: this.nepaliData.branchDetail.branchMunVdc,
            branchWardNo: this.nepaliData.branchDetail.branchWardNo,
            branchName: this.nepaliData.branchDetail.branchNameInNepali,
            borrowerName: this.nepaliData.nepaliName,
            companyRegistrationNo: this.nepaliData.registrationNo,
            registrationNikayaName: this.nepaliData.companyRegOffice,
            registrationDate: this.nepaliData.regIssueDate,
            companyPanNumber: this.nepaliData.panNo,
            companyPanIssueOffice: this.nepaliData.panIssueOffice,
            companyPanIssueDate: this.nepaliData.panIssueDate,
            companyRegDistrict: this.nepaliData.institutionRegisteredAddress.district,
            companyRegVdc: this.nepaliData.institutionRegisteredAddress.municipality,
            companyRegWardNo: this.nepaliData.institutionRegisteredAddress.wardNo,
            companyRegTole: this.nepaliData.institutionRegisteredAddress.tole,
            companyRegTempDistrict: this.nepaliData.institutionCurrentAddress.district,
            companyRegTempVdc: this.nepaliData.institutionCurrentAddress.municipality,
            companyRegTempWardNo: this.nepaliData.institutionCurrentAddress.wardNo,
            companyRegTempTole: this.nepaliData.institutionCurrentAddress.tole,
            companyRepresentativeName: this.nepaliData.authorizedPersonDetail.name,
            companyRepresentativeGrandFatherName: this.nepaliData.authorizedPersonDetail.grandFatherName,
            companyRepresentativeFatherName: this.nepaliData.authorizedPersonDetail.fatherName,
            companyRepresentativeHusbandName: this.nepaliData.authorizedPersonDetail.husbandName,
            companyRepresentativeDistrict: this.nepaliData.authorizedPersonAddress.district,
            companyRepresentativeVdc: this.nepaliData.authorizedPersonAddress.municipality,
            companyRepresentativeWardNo: this.nepaliData.authorizedPersonAddress.wardNo,
            representativeCitizenNumber: this.nepaliData.authorizedPersonDetail.citizenShipNo,
            representativeCitizenIssueDate: this.nepaliData.authorizedPersonDetail.citizenshipIssueDate,
            representativeCitizenOffice: this.nepaliData.authorizedPersonDetail.citizenshipIssueDistrict,
            stockValue: this.nepaliData.stocksReceivablesValue.stockValue,
            debtValue: this.nepaliData.stocksReceivablesValue.receivableValue,
        });
}

  fillNepaliData() {
    if (!ObjectUtil.isEmpty(this.nepaliData)) {
      this.form.patchValue({
          branchDistrict: this.nepaliData.branchDistrict,
          branchMun: this.nepaliData.branchMun,
          branchWardNo: this.nepaliData.branchWardNo,
          branchName: this.nepaliData.branchName,
          companyName: this.nepaliData.companyName,
          companyRegistrationNo: this.nepaliData.companyRegistrationNo,
          registrationNikayaName: this.nepaliData.registrationNikayaName,
          registrationDate: this.nepaliData.registrationDate,
          companyPanNumber: this.nepaliData.companyPanNumber,
          companyPanIssueOffice: this.nepaliData.companyPanIssueOffice,
          companyPanIssueDate: this.nepaliData.companyPanIssueDate,
          companyRegDistrict: this.nepaliData.companyRegDistrict,
          companyRegVdc: this.nepaliData.companyRegVdc,
          companyRegWardNo: this.nepaliData.companyRegWardNo,
          companyRegTole: this.nepaliData.companyRegTole,
          companyRegTempDistrict: this.nepaliData.companyRegTempDistrict,
          companyRegTempVdc: this.nepaliData.companyRegTempVdc,
          companyRegTempWardNo: this.nepaliData.companyRegTempWardNo,
          companyRegTempTole: this.nepaliData.companyRegTempTole,
          companyRepresentativeName: this.nepaliData.companyRepresentativeName,
          companyRepresentativeGrandFatherName: this.nepaliData.companyRepresentativeGrandFatherName,
          companyRepresentativeFatherName: this.nepaliData.companyRepresentativeFatherName,
          companyRepresentativeHusbandName: this.nepaliData.companyRepresentativeHusbandName,
          companyRepresentativeDistrict: this.nepaliData.companyRepresentativeDistrict,
          companyRepresentativeVdc: this.nepaliData.companyRepresentativeVdc,
          companyRepresentativeWardNo: this.nepaliData.companyRepresentativeWardNo,
          representativeCitizenNumber: this.nepaliData.representativeCitizenNumber,
          representativeCitizenIssueDate: this.nepaliData.representativeCitizenIssueDate,
          representativeCitizenOffice: this.nepaliData.representativeCitizenOffice,
          stockValue: this.nepaliData.stockValue,
          debtValue: this.nepaliData.debtValue,
          districtOne: this.nepaliData.districtOne,
          municipalityOne: this.nepaliData.municipalityOne,
          wardNum: this.nepaliData.wardNum,
          ageOne: this.nepaliData.ageOne,
          sakshiName: this.nepaliData.sakshiName,
          districtTwo: this.nepaliData.districtTwo,
          municipalityTwo: this.nepaliData.municipalityTwo,
          wardNumTwo: this.nepaliData.wardNumTwo,
          ageTwo: this.nepaliData.ageTwo,
          sakshiNameTwo: this.nepaliData.sakshiNameTwo,
          role: this.nepaliData.role,
          roleName: this.nepaliData.roleName,
          itiSambatYear: this.nepaliData.itiSambatYear,
          itiSambatMonth: this.nepaliData.itiSambatMonth,
          itiSambatDay: this.nepaliData.itiSambatDay,
          roj: this.nepaliData.roj,


        customerName: this.nepaliData.name,

        proposedAmount: this.nepaliNumber.transform(this.amount, 'preeti'),
        amountInWords: this.nepaliCurrencyWordPipe.transform(this.amount)
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
            this.patchForm();
            this.form.patchValue({
                amountInWords: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(this.amount))
            });
        } else {
            this.fillNepaliData();
            this.form.patchValue({
                proposedAmount: this.nepaliNumber.transform(this.amount, 'preeti'),
                amountInWords: this.nepaliCurrencyWordPipe.transform(this.amount)
            });
        }
    }
  con(e) {
    this.form.patchValue({
      amountInWords: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(e.target.value))
    });
  }

}
