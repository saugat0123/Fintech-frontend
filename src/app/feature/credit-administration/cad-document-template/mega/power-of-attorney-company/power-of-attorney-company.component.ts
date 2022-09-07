import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';

@Component({
  selector: 'app-power-of-attorney-company',
  templateUrl: './power-of-attorney-company.component.html',
  styleUrls: ['./power-of-attorney-company.component.scss']
})
export class PowerOfAttorneyCompanyComponent implements OnInit {
  PowerOfAttorneyCompany: FormGroup;
  @Input() customerInfo: CustomerInfoData;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  nepData;
  isForEdit = false;
  guarantorData;
  submitted = false;
  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit(): void {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const data = JSON.parse(singleCadFile.initialInformation);
          this.PowerOfAttorneyCompany.patchValue(data);
          this.setName(data);
          this.isForEdit = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
      this.guarantorData = Object.values(this.nepData.guarantorDetails);
      if (!this.isForEdit) {
        this.fillForm();
      }
    }
  }

  buildForm() {
    this.PowerOfAttorneyCompany = this.formBuilder.group({
      bankBranchName: [undefined],
      guarantorGrandFatherName: [undefined],
      guarrantorFatherName: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipalityOrVdc: [undefined],
      guarantorWardNo: [undefined],
      tempProvinceNo: [undefined],
      tempAddDistrict: [undefined],
      tempAddMunicipality: [undefined],
      tempAddWardNo: [undefined],
      tempAddress: [undefined],
      guarantorAge: [undefined],
      guarantorName: [undefined],
      guarantorCitizenshipNum: [undefined],
      guarantorIssueDate: [undefined],
      guarantorIssueDistrict: [undefined],
      guarantorGrandfather1: [undefined],
      guarrantorFatherName1: [undefined],
      guarantorDistrict1: [undefined],
      guarantorMunicipalityOrVdc1: [undefined],
      guarantorWardNo1: [undefined],
      guarantorProvinceNo: [undefined],
      tempAddDistrict1: [undefined],
      TempAddMunicipality1: [undefined],
      tempAddWardNo1: [undefined],
      tempAddress1: [undefined],
      guarantorAge1: [undefined],
      guarantorName1: [undefined],
      guarantorCitizenshipNo1: [undefined],
      CitizenshipIssuedDate1: [undefined],
      CitizenshipIssuedDistrict1: [undefined],
      guarantorGrandFather2: [undefined],
      guarrantorFatherName2: [undefined],
      borrowerDistrict: [undefined],
      borrowerMunicipalityOrVdc: [undefined],
      borrowerWardNo: [undefined],
      borrowerProvinceNo: [undefined],
      borrowerTempDistrict: [undefined],
      tempMunicipalityOrVdc2: [undefined],
      tempWardNo2: [undefined],
      tempAddress2: [undefined],
      borrowerAge: [undefined],
      borrowerName: [undefined],
      borrowerCitizenshipNo: [undefined],
      borrowerCitizenshipIssuedDate: [undefined],
      borrowerCitizenshipIssuedDistrict: [undefined],
      numberOfGuarantor: [undefined],
      loanApprovalDate: [undefined],
      loanAmount: [undefined],
      loanAmtInWord: [undefined],
      loanFacility1: [undefined],
      purpose1: [undefined],
      loanFacilityAmount1: [undefined],
      interestRate1: [undefined],
      timePeriod1: [undefined],
      apology1: [undefined],
      loanFacility2: [undefined],
      purpose2: [undefined],
      loanFacilityAmount2: [undefined],
      interestRate2: [undefined],
      timePeriod2: [undefined],
      apology2: [undefined],
      staffName: [undefined],
      guarantorName2: [undefined],
      guarantorAddress: [undefined],
      docWrittenYear: [undefined],
      docWrittenMonth: [undefined],
      docWrittenDay: [undefined],
      docWrittenWeek: [undefined],
      witnessDistrict1: [undefined],
      witnessMunicipalityOrVdc1: [undefined],
      witnessWardNo1: [undefined],
      witnessAge1: [undefined],
      witnessName1: [undefined],
      witnessDistrict2: [undefined],
      witnessMunicipalityOrVdc2: [undefined],
      witnessWardNo2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
      date: [undefined],
      date1: [undefined],
      registerNum: [undefined],
      meroHamroName: [undefined],
      jariVayeko: [undefined],
      guarantorName3: this.formBuilder.array([]),
    });
  }
  fillForm() {
    this.PowerOfAttorneyCompany.patchValue({
      bankBranchName: [!ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : ''],
      date: [!ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : ''],
      registerNum: [!ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : ''],
      // tslint:disable-next-line:max-line-length
      tempAddDistrict: [!ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
      // tslint:disable-next-line:max-line-length
      guarantorMunicipalityOrVdc: [!ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.municipality : ''],
      guarantorWardNo: [!ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.wardNo : ''],
      staffName: [!ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : ''],
      guarantorName: [!ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : ''],
      loanApprovalDate: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.offerIssueDate : ''],
      loanAmount: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : ''],
      loanAmtInWord: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : ''],
      guarantorName3: [!ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : ''],
      guarantorDistrict: [!ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.district : ''],
    });
    if (!ObjectUtil.isEmpty(this.nepData)) {
      if (!ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail.name)) {
        this.addName();
        this.PowerOfAttorneyCompany.get(['guarantorName3', 0, 'guarantorName3']).patchValue(this.nepData.authorizedPersonDetail.name);
      }
    }
  }
  changeToNepAmount(event: any, target, from) {
    this.PowerOfAttorneyCompany.get([target]).patchValue(event.nepVal);
    this.PowerOfAttorneyCompany.get([from]).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.PowerOfAttorneyCompany.get([target]).value;
    return patchValue1;
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.PowerOfAttorneyCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.PowerOfAttorneyCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.PowerOfAttorneyCompany.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.dialogRef.close();
    });
  }
  addName() {
    (this.PowerOfAttorneyCompany.get('guarantorName3') as FormArray).push(this.formBuilder.group({
      guarantorName3: [undefined],
    }));
  }

  remove(i) {
    (this.PowerOfAttorneyCompany.get('guarantorName3') as FormArray).removeAt(i);
  }

  setName(data) {
    if (data.length < 0) {
      this.addName();
    }
    data.guarantorName3.forEach(d => {
      (this.PowerOfAttorneyCompany.get('guarantorName3') as FormArray).push(this.formBuilder.group({
        guarantorName3: [d ? d.guarantorName3 : undefined],
      }));
    });
  }
}
