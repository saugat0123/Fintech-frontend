import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
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
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-hypothecation-charge-over-fixed-assets',
  templateUrl: './hypothecation-charge-over-fixed-assets.component.html',
  styleUrls: ['./hypothecation-charge-over-fixed-assets.component.scss']
})
export class HypothecationChargeOverFixedAssetsComponent implements OnInit {
  @Input() cadData;
  @Input() documentId;
  @Input() customerLoanId;
  form: FormGroup;
  spinner = false;
  initialInfoPrint;
  cadCheckListEnum = CadCheckListTemplateEnum;
  nepaliData;
  amount;
  customerInfo;
  collateralDetails = [];
  landDetails = [];

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
  ) { }

  ngOnInit() {
    this.buildForm();
    this.amount = this.cadData.assignedLoan[0].proposal.proposedLimit;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = singleCadFile.initialInformation;
          if (!ObjectUtil.isEmpty( JSON.parse(singleCadFile.initialInformation).rupees)) {
            this.amount = JSON.parse(singleCadFile.initialInformation).rupees;
          }
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      if (!ObjectUtil.isEmpty(this.nepaliData)) {
        this.nepaliData.collateralDetails.forEach((val) => {
          const plantMachineryData = val.plantMachineryDetail;
          const landData = val.landAndBuildingDetail;
          if (!ObjectUtil.isEmpty(plantMachineryData)) {
            this.collateralDetails.push(plantMachineryData);
          }
          if (!ObjectUtil.isEmpty(landData)) {
            this.landDetails.push(landData);
          }
        });
      }
    }
    console.log('nepali data::', this.nepaliData);
    if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
      this.form.patchValue(JSON.parse(this.initialInfoPrint));
      this.form.patchValue({
        amount: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(this.amount)),
        branchDistrict: this.nepaliData.branchDetail.branchDistrict,
        branchMun: this.nepaliData.branchDetail.branchMunVdc,
        branchWardNo: this.nepaliData.branchDetail.branchWardNo,
        branchName: this.nepaliData.branchDetail.branchNameInNepali,
        borrowerName: this.nepaliData.nepaliName,
        acceptanceNumber: this.nepaliData.miscellaneousDetail.offerReferenceNo,
        date: this.nepaliData.miscellaneousDetail.offerIssueDate,
        proposedAmount: this.nepaliData.miscellaneousDetail.loanAmountInFig,
        amountInWords: this.nepaliData.miscellaneousDetail.loanAmountInWord,
        companyName: this.nepaliData.nepaliName,
        companyRegistrationNo: this.nepaliData.registrationNo,
        registrationDate: this.nepaliData.regIssueDate,
        registrationNikayaName: this.nepaliData.companyRegOffice,
        companyPanNumber: this.nepaliData.panNo,
        companyPanIssueOffice: this.nepaliData.panIssueOffice,
        companyPanIssueDate: this.nepaliData.panIssueDate,
        companyRepresentativeName: this.nepaliData.authorizedPersonDetail.name,
        companyRepresentativeGrandFatherName: this.nepaliData.authorizedPersonDetail.grandFatherName,
        companyRepresentativeFatherName: this.nepaliData.authorizedPersonDetail.fatherName,
        companyRepresentativeHusbandName: this.nepaliData.authorizedPersonDetail.husbandName,
        companyRepresentativeDistrict: this.nepaliData.authorizedPersonAddress.district,
        companyRepresentativeVdc: this.nepaliData.authorizedPersonAddress.municipality,
        companyRepresentativeWardNo: this.nepaliData.authorizedPersonAddress.wardNo,
        representativeCitizenNumber: this.nepaliData.authorizedPersonDetail.citizenshipNo,
        representativeCitizenIssueDate: this.nepaliData.authorizedPersonDetail.citizenshipIssueDate,
        representativeCitizenOffice: this.nepaliData.authorizedPersonDetail.citizenshipIssueDistrict,
        debtorMortgageDistrict: this.landDetails[0].district,
        debtorMortgageMunicipality: this.landDetails[0].municipality,
        debtorMortgageWardNo: this.landDetails[0].wardNo,
        kittaNumber: this.landDetails[0].plotNo,
        nepaliName1: this.nepaliData.nepaliName,
        englishName1: this.nepaliData.name,
        dateOfBirth1: this.nepaliData.dateOfBirth,
        gender1: this.nepaliData.gender === '1' ? 'पुरुष' : 'महिला',
        citizenNumber: this.nepaliData.citizenshipNo,
        citizenIssueDate: this.nepaliData.citizenshipIssueDate,
        citizenIssueOffice: this.nepaliData.citizenshipIssueDistrict,
        borrowerMobileNo: this.nepaliData.contactNo,
        borrowerHusbandName: this.nepaliData.husbandName,
        borrowerFatherName: this.nepaliData.fatherName,
        borrowerGrandFatherName: this.nepaliData.grandFatherName,
        companyRegDistrict: this.nepaliData.institutionRegisteredAddress.district,
        companyRegVdc: this.nepaliData.institutionRegisteredAddress.municipality,
        companyRegWardNo: this.nepaliData.institutionRegisteredAddress.wardNo,
        companyRegTole: this.nepaliData.institutionRegisteredAddress.tole,
        companyRegTempDistrict: this.nepaliData.institutionCurrentAddress.district,
        companyRegTempVdc: this.nepaliData.institutionCurrentAddress.municipality,
        companyRegTempWardNo: this.nepaliData.institutionCurrentAddress.wardNo,
        companyRegTempTole: this.nepaliData.institutionCurrentAddress.tole,
      });
    } else {
      this.fillForm();
    }
  }
  fillForm() {
    if (!ObjectUtil.isEmpty(this.nepaliData)) {
      const customerTempAddress =
          this.nepaliData.temporaryMunicipality + ' j8f g+ ' +
          this.nepaliData.temporaryWard + ', ' +
          this.nepaliData.temporaryDistrict;
      this.form.patchValue({
        grandFatherName: this.nepaliData.grandFatherName,
        fatherName: this.nepaliData.fatherName ? this.nepaliData.fatherName : this.nepaliData.fatherInLawName,
        spouseName: this.nepaliData.spouseName,
        customerPerDistrict: this.nepaliData.permanentDistrict,
        customerPerMunicipality: this.nepaliData.permanentMunicipality,
        customerPerWardNo: this.nepaliData.permanentWard,
        customerTempAddress: customerTempAddress ? customerTempAddress : '',
        customerAge: this.nepaliData.age,
        citizenshipIssueDistrict: this.nepaliData.citizenshipIssueDistrict,
        citizenshipIssueDate: this.nepaliData.citizenshipIssueDate,
        customerName: this.nepaliData.name,
        rupees: this.nepaliNumber.transform(this.amount, 'preeti'),
        amount: this.nepaliCurrencyWordPipe.transform(this.amount),
        branchDistrict: this.nepaliData.branchDetail.branchDistrict,
        branchMun: this.nepaliData.branchDetail.branchMunVdc,
        branchWardNo: this.nepaliData.branchDetail.branchWardNo,
        branchName: this.nepaliData.branchDetail.branchNameInNepali,
        borrowerName: this.nepaliData.nepaliName,
        acceptanceNumber: this.nepaliData.miscellaneousDetail.offerReferenceNo,
        date: this.nepaliData.miscellaneousDetail.offerIssueDate,
        proposedAmount: this.nepaliData.miscellaneousDetail.loanAmountInFig,
        amountInWords: this.nepaliData.miscellaneousDetail.loanAmountInWord,
        companyName: this.nepaliData.nepaliName,
        companyRegistrationNo: this.nepaliData.registrationNo,
        registrationDate: this.nepaliData.regIssueDate,
        registrationNikayaName: this.nepaliData.companyRegOffice,
        companyPanNumber: this.nepaliData.panNo,
        companyPanIssueOffice: this.nepaliData.panIssueOffice,
        companyPanIssueDate: this.nepaliData.panIssueDate,
        companyRepresentativeName: this.nepaliData.authorizedPersonDetail.name,
        companyRepresentativeGrandFatherName: this.nepaliData.authorizedPersonDetail.grandFatherName,
        companyRepresentativeFatherName: this.nepaliData.authorizedPersonDetail.fatherName,
        companyRepresentativeHusbandName: this.nepaliData.authorizedPersonDetail.husbandName,
        companyRepresentativeDistrict: this.nepaliData.authorizedPersonAddress.district,
        companyRepresentativeVdc: this.nepaliData.authorizedPersonAddress.municipality,
        companyRepresentativeWardNo: this.nepaliData.authorizedPersonAddress.wardNo,
        representativeCitizenNumber: this.nepaliData.authorizedPersonDetail.citizenshipNo,
        representativeCitizenIssueDate: this.nepaliData.authorizedPersonDetail.citizenshipIssueDate,
        representativeCitizenOffice: this.nepaliData.authorizedPersonDetail.citizenshipIssueDistrict,
        debtorMortgageDistrict: this.landDetails[0].district,
        debtorMortgageMunicipality: this.landDetails[0].municipality,
        debtorMortgageWardNo: this.landDetails[0].wardNo,
        kittaNumber: this.landDetails[0].plotNo,
        nepaliName1: this.nepaliData.nepaliName,
        englishName1: this.nepaliData.name,
        dateOfBirth1: this.nepaliData.dateOfBirth,
        gender1: this.nepaliData.gender === '1' ? 'पुरुष' : 'महिला',
        citizenNumber: this.nepaliData.citizenshipNo,
        citizenIssueDate: this.nepaliData.citizenshipIssueDate,
        citizenIssueOffice: this.nepaliData.citizenshipIssueDistrict,
        borrowerMobileNo: this.nepaliData.contactNo,
        borrowerHusbandName: this.nepaliData.husbandName,
        borrowerFatherName: this.nepaliData.fatherName,
        borrowerGrandFatherName: this.nepaliData.grandFatherName,
        companyRegDistrict: this.nepaliData.institutionRegisteredAddress.district,
        companyRegVdc: this.nepaliData.institutionRegisteredAddress.municipality,
        companyRegWardNo: this.nepaliData.institutionRegisteredAddress.wardNo,
        companyRegTole: this.nepaliData.institutionRegisteredAddress.tole,
        companyRegTempDistrict: this.nepaliData.institutionCurrentAddress.district,
        companyRegTempVdc: this.nepaliData.institutionCurrentAddress.municipality,
        companyRegTempWardNo: this.nepaliData.institutionCurrentAddress.wardNo,
        companyRegTempTole: this.nepaliData.institutionCurrentAddress.tole,
      });
    }
  }
  submit() {
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
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.spinner = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      branchDistrict: [undefined],
      branchMun: [undefined],
      branchWardNo: [undefined],
      branchName: [undefined],
      ministry: [undefined],
      bureauOfMinistry: [undefined],
      privateLimitedNum: [undefined],
      registrationDate: [undefined],
      registrationDistrict: [undefined],
      registrationMunicipality: [undefined],
      registrationWardNum: [undefined],
      taxationBureau: [undefined],
      lekhaNumber: [undefined],
      registrationDate1: [undefined],
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
      companyName: [undefined],
      companyRegistrationNo: [undefined],
      registrationNikayaName: [undefined],
      companyPanNumber: [undefined],
      companyPanIssueOffice: [undefined],
      companyPanIssueDate: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      spouseName: [undefined],
      customerPerDistrict: [undefined],
      customerPerMunicipality: [undefined],
      customerPerWardNo: [undefined],
      customerTempAddress: [undefined],
      customerAge: [undefined],
      customerName: [undefined],
      customerCitizenshipNo: [undefined],
      citizenshipIssueDistrict: [undefined],
      citizenshipIssueDate: [undefined],
      rupees: [undefined],
      amount: [undefined],
      debtorMortgageDistrict: [undefined],
      debtorMortgageMunicipality: [undefined],
      kittaNumber: [undefined],
      witnessDistrict1: [undefined],
      witnessMunicipality1: [undefined],
      witnessWardNum1: [undefined],
      witnessAge1: [undefined],
      witnessName1: [undefined],
      witnessDistrict2: [undefined],
      witnessMunicipality2: [undefined],
      witnessWardNum2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
      shanakhatWitnessPosition: [undefined],
      shanakhatWitnessName: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      roj: [undefined],
      shuvam: [undefined],
      debtorMortgageWardNo: [undefined]
    });
  }

  con(e) {
    this.form.patchValue({
      amount: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(e.target.value))
    });
  }
}
