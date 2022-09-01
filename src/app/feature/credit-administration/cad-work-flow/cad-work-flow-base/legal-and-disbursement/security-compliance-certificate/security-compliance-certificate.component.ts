import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CompanyInfoService} from '../../../../../admin/service/company-info.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CustomerType} from '../../../../../customer/model/customerType';
import {LocalStorageUtil} from '../../../../../../@core/utils/local-storage-util';
import {RoleType} from '../../../../../admin/modal/roleType';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Editor} from '../../../../../../@core/utils/constants/editor';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {CommonAddressComponent} from '../../../../../common-address/common-address.component';
import {DocumentChecklistViewLiteComponent} from '../../../../cad-view/document-checklist-view-lite/document-checklist-view-lite.component';
import {CommonService} from '../../../../../../@core/service/common.service';
import {ApiConfig} from '../../../../../../@core/utils/api/ApiConfig';

@Component({
  selector: 'app-security-compliance-certificate',
  templateUrl: './security-compliance-certificate.component.html',
  styleUrls: ['./security-compliance-certificate.component.scss']
})
export class SecurityComplianceCertificateComponent implements OnInit {
  @ViewChild('documentChecklistViewLite', {static: false}) documentChecklistViewLite: DocumentChecklistViewLiteComponent;
  @Input() cadFile: CustomerApprovedLoanCadDocumentation;
  panNumber;
  uploadFile;
  date = new Date();
  customerType = CustomerType;
  cadCheckListListVersion = LocalStorageUtil.getStorage().productUtil.CHECK_LIST_LITE_VERSION;
  affiliatedId = LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID;
  sccRefNumber;
  securityCode;
  userType = LocalStorageUtil.getStorage().roleType;
  isMaker = false;
  spinner = false;
  docStatus = CadDocStatus;
  ckeConfig;
  sccForm: FormGroup;
  sccData;
  sumbit = false;
  isInstitution = false;
  isIndividual = false;
  isJoint = false;
  jsonData;
  olRefNumber;
  documentCheckListData;
  sccPath;
  baselDetails;
  gssCode;
  totalStage = [];
  RootUrl = ApiConfig.URL;
  constructor(protected dialogRef: NbDialogRef<SecurityComplianceCertificateComponent>,
              private creditAdministrationService: CreditAdministrationService,
              private ngbModal: NgbModal,
              private nbDialogService: NbDialogService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private companyInfoService: CompanyInfoService,
              private formBuilder: FormBuilder,
              private spinnerService: NgxSpinnerService,
              public service: CommonService
  ) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadFile.sccData)) {
      this.sccData = JSON.parse(this.cadFile.sccData);
    }
    if (!ObjectUtil.isEmpty(this.cadFile)) {
      if (!ObjectUtil.isEmpty(this.cadFile.baselCode)) {
        this.baselDetails = this.cadFile.baselCode;
      }
      if (!ObjectUtil.isEmpty(this.cadFile.loanHolder) && !ObjectUtil.isEmpty(this.cadFile.loanHolder.gssData)) {
        const data = JSON.parse(this.cadFile.loanHolder.gssData);
        this.gssCode = data.groupCode ? data.groupCode : '';
      }
      if (!ObjectUtil.isEmpty(this.cadFile.sccStage)) {
        this.totalStage = this.cadFile.sccStage;
      }
    }
    this.buildSccForm();
    if (!ObjectUtil.isEmpty(this.cadFile.sccData)) {
      this.sccData = JSON.parse(this.cadFile.sccData);
      if (!ObjectUtil.isEmpty(this.sccData.remarkChecked)) {
        this.checkChecked(this.sccData.remarkChecked);
      }
      if (!ObjectUtil.isEmpty(this.sccData.drawDownDetails)) {
        if (this.sccData.drawDownDetails.length > 0) {
          this.sccData.drawDownDetails.forEach(val => {
            this.setDrawDownDetail(val);
          });
        }
      } else {
        this.addDrawDownDetail();
      }
    } else {
      this.addDrawDownDetail();
    }
    if (!ObjectUtil.isEmpty(this.cadFile.exposure)) {
      this.sccPath = JSON.parse(this.cadFile.exposure.data).sccPath;
    }
    if (this.cadFile.loanHolder.customerType === 'INDIVIDUAL') {
      this.isIndividual = true;
      this.jsonData = JSON.parse(this.cadFile.assignedLoan[0].customerInfo.individualJsonData);
      if (!ObjectUtil.isEmpty(this.cadFile.assignedLoan[0].customerInfo.isJointCustomer)) {
        this.isJoint = true;
      }
    } else {
      this.isInstitution = false;
      this.jsonData = JSON.parse(this.cadFile.assignedLoan[0].companyInfo.companyJsonData);
    }
    this.configEditor();
    this.getCompanyPan();
    this.setSccRefNumber();
    this.getSecurityCode();
    if (this.userType === RoleType.MAKER) {
      this.isMaker = true;
    }
  }

  buildSccForm() {
    this.sccForm = this.formBuilder.group({
      dateOfScc: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.dateOfScc) ? new Date() :
              new Date(this.sccData.dateOfScc)],
      purposeOfScc: [ObjectUtil.isEmpty(this.sccData) ? '' :
          ObjectUtil.isEmpty(this.sccData.purposeOfScc) ? '' :
              this.sccData.purposeOfScc, Validators.compose([Validators.required])],
      cibObtained: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.cibObtained) ? new Date() :
              new Date(this.sccData.cibObtained), Validators.compose([Validators.required])],
      strObtained: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.strObtained) ? new Date() :
              new Date(this.sccData.strObtained)],
      strLapsed: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.strLapsed) ? new Date() :
              new Date(this.sccData.strLapsed)],
      iffObtained: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.iffObtained) ? new Date() :
              new Date(this.sccData.iffObtained)],
      kyc: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.kyc) ? new Date() :
              new Date(this.sccData.kyc), Validators.compose([Validators.required])],
      irdSubmission: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.irdSubmission) ? undefined : this.sccData.irdSubmission],
      declaration: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.declaration) ? new Date() :
              new Date(this.sccData.declaration)],
      caApproved: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.caApproved) ? new Date() :
              new Date(this.sccData.caApproved)],
      businessUnit: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.businessUnit) ? undefined : this.sccData.businessUnit],
      cashDeposit: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.cashDeposit) ? undefined : this.sccData.cashDeposit],
      cashDepositValue: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.cashDepositValue) ? undefined : this.sccData.cashDepositValue],
      fixDeposit: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.fixDeposit) ? undefined : this.sccData.fixDeposit],
      fixDepositValue: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.fixDepositValue) ? undefined : this.sccData.fixDepositValue],
      gold: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.gold) ? undefined : this.sccData.gold],
      goldValue: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.goldValue) ? undefined : this.sccData.goldValue],
      securities: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.securities) ? undefined : this.sccData.securities],
      securitiesValue: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.securitiesValue) ? undefined : this.sccData.securitiesValue],
      government: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.government) ? undefined : this.sccData.government],
      governmentValue: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.governmentValue) ? undefined : this.sccData.governmentValue],
      financial: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.financial) ? undefined : this.sccData.financial],
      financialValue: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.financialValue) ? undefined : this.sccData.financialValue],
      counter: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.counter) ? undefined : this.sccData.counter],
      counterValue: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.counterValue) ? undefined : this.sccData.counterValue],
      guarantee: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.guarantee) ? undefined : this.sccData.guarantee],
      guaranteeValue: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.guaranteeValue) ? undefined : this.sccData.guaranteeValue],
      eca: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.eca) ? undefined : this.sccData.eca],
      ecaValue: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.ecaValue) ? undefined : this.sccData.ecaValue],
      valuation: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.valuation) ? undefined : this.sccData.valuation],
      makuri: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.makuri) ? undefined : this.sccData.makuri],
      verification: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.verification) ? undefined : this.sccData.verification],
      drawDownDetails: this.formBuilder.array([]),
      notes: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.notes) ? undefined : this.sccData.notes],
      discrepancy: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.discrepancy) ? undefined : this.sccData.discrepancy],
      instruction: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.instruction) ? undefined : this.sccData.instruction],
      nameOfCustodian: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.nameOfCustodian) ? undefined : this.sccData.nameOfCustodian],
      vaultNo: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.vaultNo) ? undefined : this.sccData.vaultNo],
      obtainedDate: [undefined],
      approvedRemark: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.approvedRemark) ? undefined : this.sccData.approvedRemark],
      remarkChecked: [false]
    });
  }

  getCompanyPan() {
    if (!ObjectUtil.isEmpty(this.cadFile) && this.cadFile.loanHolder.customerType === this.customerType.INSTITUTION) {
      this.companyInfoService.detail(this.cadFile.loanHolder.associateId).subscribe((res: any) => {
        this.panNumber = res.detail.panNumber;
      });
    }
  }
  removeDrawDown(i) {
    (this.sccForm.get('drawDownDetails') as FormArray).removeAt(i);
  }

  addDrawDownDetail() {
    (this.sccForm.get('drawDownDetails') as FormArray).push(this.formBuilder.group({
      drawDownNTA: [undefined],
      drawDownFMV: [undefined],
      drawDownTax: [undefined],
      facilityName: [undefined],
      emiType: [undefined],
      emiStartDate: [new Date()],
      emiEndDate: [new Date()],
    }));
  }

  setDrawDownDetail(val) {
    (this.sccForm.get('drawDownDetails') as FormArray).push(this.formBuilder.group({
      drawDownNTA: [ObjectUtil.isEmpty(val) ? undefined :
          ObjectUtil.isEmpty(val.drawDownNTA) ? undefined : val.drawDownNTA],
      drawDownFMV: [ObjectUtil.isEmpty(val) ? undefined :
          ObjectUtil.isEmpty(val.drawDownFMV) ? undefined : val.drawDownFMV],
      drawDownTax: [ObjectUtil.isEmpty(val) ? undefined :
          ObjectUtil.isEmpty(val.drawDownTax) ? undefined : val.drawDownTax],
      facilityName: [ObjectUtil.isEmpty(val) ? undefined :
          ObjectUtil.isEmpty(val.facilityName) ? undefined : val.facilityName],
      emiType: [ObjectUtil.isEmpty(val) ? undefined :
          ObjectUtil.isEmpty(val.emiType) ? undefined : val.emiType],
      emiStartDate: [ObjectUtil.isEmpty(val) ? new Date() :
          ObjectUtil.isEmpty(val.caApproved) ? new Date() :
              new Date(val.caApproved)],
      emiEndDate: [ObjectUtil.isEmpty(val) ? new Date() :
          ObjectUtil.isEmpty(val.caApproved) ? new Date() :
              new Date(val.caApproved)]
    }));
  }

  setSccRefNumber() {
    const date = new Date();
    this.sccRefNumber = 'SCC'.concat(date.getFullYear().toString()).concat('/').concat((date.getMonth() + 1).toString()).concat('/')
        .concat(date.getDate().toString()).concat('/').concat('/').concat(this.cadFile.id.toString().padStart(4, '0'));
    this.olRefNumber = 'OL'.concat(date.getFullYear().toString()).concat('/').concat((date.getMonth() + 1).toString()).concat('/')
        .concat(date.getDate().toString()).concat('/').concat('/').concat(this.cadFile.id.toString().padStart(4, '0'));
  }

  onSave() {
    this.sumbit = true;
    this.save();
  }

  onClose() {
    this.dialogRef.close();
  }

  openDocUploadModal(modal) {
    this.ngbModal.open(modal);
  }

  uploadDoc(event) {
    this.uploadFile = event.target.files[0];
    this.sumbit = false;
  }

  save() {
    this.spinner = true;
    this.spinnerService.show();
    if (this.sccForm.invalid) {
      this.spinner = false;
      this.spinnerService.hide();
      return;
    }
    if (this.sumbit) {
      this.documentCheckListData = JSON.stringify(this.documentChecklistViewLite.obtainedOnForm.get('obtainedFormData').value);
      this.sccForm.get('obtainedDate').patchValue(this.documentCheckListData);
      if (ObjectUtil.isEmpty(this.cadFile.sccData)) {
        this.cadFile.cadCurrentStage.sccGenerate = true;
      } else {
        this.cadFile.cadCurrentStage.sccGenerate = false;
      }
      this.cadFile.sccData = JSON.stringify(this.sccForm.value);
      this.saveCadFile();
    } else {
      const formData: FormData = new FormData();
      formData.append('file', this.uploadFile);
      formData.append('customerInfoId', this.cadFile.loanHolder.id.toString());
      formData.append('cadId', this.cadFile.id.toString());
      formData.append('docName', new Date().toString());
      formData.append('branchId', this.cadFile.loanHolder.branch.id.toString());
      if (ObjectUtil.isEmpty(this.cadFile.exposure)) {
        this.spinner = false;
        this.spinnerService.hide();
        this.modelClose();
        this.toastService.show(new Alert(AlertType.WARNING, 'Exposure details are missing'));
        return;
      }
      this.creditAdministrationService.getSccDocPath(formData).subscribe((res: any) => {
        const mergeData = {
          disbursementDetails: this.cadFile.exposure ? JSON.parse(this.cadFile.exposure.data).disbursementDetails : {},
          sccPath: res.detail
        };
        this.spinnerService.hide();
        this.cadFile.exposure.data = JSON.stringify(mergeData);
        this.saveCadFile();
      }, error => {
        console.log(error);
        this.spinnerService.hide();
        this.spinner = false;
        this.toastService.show(new Alert(AlertType.ERROR, error));
      });
    }
  }

  saveCadFile() {
    this.creditAdministrationService.saveCadDocumentBulk(this.cadFile).subscribe((response: any) => {
      this.modelClose();
      this.onClose();
      this.spinnerService.hide();
      this.spinner = false;
      this.routerUtilsService.reloadCadProfileRouteWithActiveTab(this.cadFile.id, 0);
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully upload SCC File'));
    }, error => {
      this.modelClose();
      this.spinner = false;
      this.spinnerService.hide();
      console.log(error);
      this.toastService.show(new Alert(AlertType.ERROR, error));
    });
  }
  modelClose() {
    this.ngbModal.dismissAll();
  }

  getSecurityCode() {
    if (!ObjectUtil.isEmpty(this.cadFile) && !ObjectUtil.isEmpty(this.cadFile.data)) {
      const accountData = JSON.parse(this.cadFile.data);
      if (!ObjectUtil.isEmpty(accountData)) {
        this.securityCode = ObjectUtil.separateFirstDash(accountData.acInfo.securityType);
      }
    }
  }

  configEditor() {
    this.ckeConfig = Editor.CK_CONFIG;
  }

  checkChecked(event) {
      if (event) {
        this.sccForm.get('remarkChecked').setValue(true);
      } else {
        this.sccForm.get('remarkChecked').setValue(false);
        this.sccForm.get('approvedRemark').setValue(null);
      }
  }

}
