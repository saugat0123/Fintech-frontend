import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
  selector: 'app-consent-letter-company',
  templateUrl: './consent-letter-company.component.html',
  styleUrls: ['./consent-letter-company.component.scss']
})
export class ConsentLetterCompanyComponent implements OnInit {


  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  consentLetterCompany: FormGroup;
  nepData;
  initialInfo;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfo = JSON.parse(singleCadFile.initialInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.consentLetterCompany.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
  }

  buildForm() {
    this.consentLetterCompany = this.formBuilder.group({
      companyAct: [undefined],
      landOwnerMunicipality: [undefined],
      branchOffice: [undefined],
      ministryOffice: [undefined],
      CompanyRegistrationDate: [undefined],
      registrationNum: [undefined],
      institutionRegisteredDistrict: [undefined],
      institutionRegisteredVdcOrMunicipality: [undefined],
      institutionRegisteredWard: [undefined],
      borrowerName: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      FACOwnerName: [undefined],
      landOwnerName: [undefined],
      landOwnerDistrict: [undefined],
      landOwnerWard: [undefined],
      landOwnerTole: [undefined],
      landOwnerKittaNo: [undefined],
      landArea: [undefined],
      fullYear: [undefined],
      monthOfYear: [undefined],
      dayOfMonth: [undefined],
      timeOfDay: [undefined],
      witnessOne: [undefined],
      witnessTwo: [undefined],
      agreementPerson1: [undefined],
      relationWithBorrower: [undefined],
      agreementPerson2: [undefined],
      relationWithBorrower1: [undefined],
    });
  }
  fillForm() {
    this.consentLetterCompany.patchValue({
          branchOffice: [!ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchNameInNepali : ''],
          ministryOffice: [!ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : ''],
          CompanyRegistrationDate: [!ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : ''],
          registrationNum: [!ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : ''],
          institutionRegisteredDistrict: [!ObjectUtil.isEmpty
          (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
          institutionRegisteredVdcOrMunicipality: [!ObjectUtil.isEmpty
          (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
          institutionRegisteredWard: [!ObjectUtil.isEmpty
          (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.municipality : ''],
          borrowerName: [!ObjectUtil.isEmpty
          (this.nepData.nepaliName) ? this.nepData.nepaliName : ''],
          amount: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : ''],
          amountInWords: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : ''],
          FACOwnerName: [!ObjectUtil.isEmpty
          (this.nepData.collateralDetails[0]) ? this.nepData.collateralDetails[0].nameInNepali : ''],
          landOwnerName: [!ObjectUtil.isEmpty
          (this.nepData.collateralDetails[0]) ? this.nepData.collateralDetails[0].nameInNepali : ''],
          landOwnerDistrict: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0].landAndBuildingDetail)
              ? this.nepData.collateralDetails[0].landAndBuildingDetail.district : ''],
          landOwnerMunicipality: [!ObjectUtil.isEmpty
          (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.municipality : ''],
          landOwnerWard: [!ObjectUtil.isEmpty
          (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.wardNo : ''],
          landOwnerTole: [!ObjectUtil.isEmpty
          (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.tole : ''],
          landOwnerKittaNo: [!ObjectUtil.isEmpty
          (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.plotNo : ''],
          landArea: [!ObjectUtil.isEmpty
          (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.area : ''],
        }
    );
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.consentLetterCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.consentLetterCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.consentLetterCompany.value);
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
    changeToNepAmount(event: any, target, from) {
        this.consentLetterCompany.get([target]).patchValue(event.nepVal);
        this.consentLetterCompany.get([from]).patchValue(event.val);
    }

    patchFunction(target) {
        const patchValue1 = this.consentLetterCompany.get([target]).value;
        return patchValue1;
    }
}
