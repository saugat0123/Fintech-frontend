import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerType} from '../../../../customer/model/customerType';
import {CustomerSubType} from '../../../../customer/model/customerSubType';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-letter-vehicle-thirdparty-company',
  templateUrl: './letter-vehicle-thirdparty-company.component.html',
  styleUrls: ['./letter-vehicle-thirdparty-company.component.scss']
})
export class LetterVehicleThirdpartyCompanyComponent implements OnInit {
  letterVehicleThirdPartyCompany: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  individualData;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  nepaliNumber = new NepaliNumberAndWords();
  educationInterestRate: any;
  form: FormGroup;
  nepData;
  clientType;
  customerType = CustomerType;
  customerSubType = CustomerSubType;
  jointInfoData;
  selectiveArr = [];
  offerLetterDocument;
  educationalTemplateData;
  nameOfAct = 'प्राईभेट फर्म रजिष्ट्रेशन';
  actYear = '२०१४';
  nameOfAuthorizedBody = 'नेपाल सरकार';
  offerDocumentDetails: any;
  supportedInfo;
  loanHolderNepData: any;
  spinner = false;

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
      public datePipe: DatePipe,
      private englishNepaliDatePipe: EngNepDatePipe,
  ) { }

  ngOnInit() {
    this.buildForm();
    // if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
    //   this.cadData.cadFileList.forEach(individualCadFile => {
    //     if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
    //       const initialInfo = JSON.parse(individualCadFile.initialInformation);
    //       this.initialInfoPrint = initialInfo;
    //       this.letterVehicleThirdPartyCompany.patchValue(initialInfo);
    //     }
    //   });
    // }
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
      this.clientType = this.cadData.loanHolder['customerSubType'];

      this.loanHolderNepData = this.cadData.loanHolder.nepData ?
          JSON.parse(this.cadData.loanHolder.nepData) :
          this.cadData.loanHolder.nepData;
    }
    console.log('this.individualData', this.individualData);
    this.patchFreeText();
    this.fillForm();
  }
  buildForm() {
    this.letterVehicleThirdPartyCompany = this.formBuilder.group({
      date: [undefined],
      nameOfBranchLocated: [undefined],
      actName: [undefined],
      actYearInFigure: [undefined],
      nameOfDepartment: [undefined],
      dateOfRegistration: [undefined],
      registrationNo: [undefined],
      nameOfBorrower: [undefined],
      sanctionLetterIssuedDate: [undefined],
      modelTypeOfVehicle: [undefined],
      vehicleRegistrationNumber: [undefined],
      engineNumber: [undefined],
      chasisNumber: [undefined],
    });
  }
  fillForm() {
    this.letterVehicleThirdPartyCompany.patchValue(
        {
          date: this.supportedInfo ? this.supportedInfo.date : '',
          nameOfBranchLocated: this.individualData.branch ? this.individualData.branch.ct : '',
          actName: !ObjectUtil.isEmpty(this.individualData.actName) ? this.individualData.actName.ct : this.nameOfAct,
          actYearInFigure: this.setActYear(),
          nameOfDepartment: !ObjectUtil.isEmpty(this.individualData.authorizedBodyName) ? this.individualData.authorizedBodyName.ct : this.nameOfAuthorizedBody,
          dateOfRegistration: this.setRegistrationDate(),
          registrationNo: this.individualData.registrationNo ? this.individualData.registrationNo.ct : '',
          nameOfBorrower: this.individualData.name ? this.individualData.name.ct : '',
          sanctionLetterIssuedDate: this.setIssuedDate(),
          modelTypeOfVehicle: this.supportedInfo ? this.supportedInfo.modelTypeOfVehicle : '',
          vehicleRegistrationNumber: this.supportedInfo ? this.supportedInfo.vehicleRegistrationNumber : '',
          engineNumber: this.supportedInfo ? this.supportedInfo.engineNumber : '',
          chasisNumber: this.supportedInfo ? this.supportedInfo.chasisNumber : '',
        }
    );
  }

  setActYear() {
    let yearOfAct = '';
    if (!ObjectUtil.isEmpty(this.individualData.radioActYearDate)) {
      if (this.individualData.radioActYearDate.np === 'BS') {
        yearOfAct = this.individualData.actYear ? this.individualData.actYear.en : '';
      } else {
        yearOfAct = this.individualData.actYear ? this.individualData.actYear.en : '';
      }
    }
    return yearOfAct ? yearOfAct : this.actYear;
  }

  setRegistrationDate() {
    let regDate = '';
    if (!ObjectUtil.isEmpty(this.individualData.registrationDateOption)) {
      if (this.individualData.registrationDateOption.en === 'AD') {
        regDate = this.englishNepaliDatePipe.transform(this.individualData.registrationDate ?
            this.individualData.registrationDate.en : this.individualData.registrationDate.en, true) || '';
      } else {
        regDate = this.individualData.registrationDateNepali.en ? this.individualData.registrationDateNepali.en.nDate : '';
      }
    }
    return regDate ? regDate : '';
  }

  setIssuedDate() {
    let issuedDate = '';
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
      const dateOfApproval = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
      if (dateOfApproval === 'AD') {
        issuedDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.ct : '';
      } else {
        issuedDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.ct : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
      const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        issuedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
      } else {
        issuedDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
      issuedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
      const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        const templateDateApproval = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.en : '';
        issuedDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateApproval), true);
      } else {
        const templateDateApproval = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.en : '';
        issuedDate = templateDateApproval ? templateDateApproval.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
      const sanctionLetterDate = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
      if (sanctionLetterDate === 'AD') {
        const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.en : '';
        issuedDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateSanctionDate), true);
      } else {
        const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.en : '';
        issuedDate = templateDateSanctionDate ? templateDateSanctionDate.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.smeGlobalForm) {
      const dateOfApprovalType = this.offerDocumentDetails.smeGlobalForm.dateOfApprovalType ?
          this.offerDocumentDetails.smeGlobalForm.dateOfApprovalType : '';
      if (dateOfApprovalType === 'AD') {
        const templateDateApproval = this.offerDocumentDetails.smeGlobalForm.dateOfApproval ?
            this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT : '';
        issuedDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateApproval), true);
      } else {
        const templateDateApproval = this.offerDocumentDetails.smeGlobalForm.dateOfApprovalNepali ?
            this.offerDocumentDetails.smeGlobalForm.dateOfApprovalNepali : '';
        issuedDate = templateDateApproval ? templateDateApproval.nDate : '';
      }
    }
    return issuedDate ? issuedDate : '';
  }
  setFreeText() {
    const free1 = {
      date: this.letterVehicleThirdPartyCompany.get('date') ? this.letterVehicleThirdPartyCompany.get('date').value : '',
      modelTypeOfVehicle: this.letterVehicleThirdPartyCompany.get('modelTypeOfVehicle') ? this.letterVehicleThirdPartyCompany.get('modelTypeOfVehicle').value : '',
      vehicleRegistrationNumber: this.letterVehicleThirdPartyCompany.get('vehicleRegistrationNumber') ? this.letterVehicleThirdPartyCompany.get('vehicleRegistrationNumber').value : '',
      engineNumber: this.letterVehicleThirdPartyCompany.get('engineNumber') ? this.letterVehicleThirdPartyCompany.get('engineNumber').value : '',
      chasisNumber: this.letterVehicleThirdPartyCompany.get('chasisNumber') ? this.letterVehicleThirdPartyCompany.get('chasisNumber').value : '',
    };
    return JSON.stringify(free1);
  }

  patchFreeText() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.supportedInfo = JSON.parse(singleCadFile.supportedInformation);
        }
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
          singleCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        this.initialInfoPrint = cadFile.initialInformation;
        cadFile.supportedInformation = this.setFreeText();
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterVehicleThirdPartyCompany.value);
      this.initialInfoPrint = cadFile.initialInformation;
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
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
      this.spinner = false;
    });
  }
}
