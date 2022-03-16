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
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {CommonAddressComponent} from '../../../../../common-address/common-address.component';
import {DocumentChecklistViewLiteComponent} from '../../../../cad-view/document-checklist-view-lite/document-checklist-view-lite.component';

@Component({
  selector: 'app-security-compliance-certificate',
  templateUrl: './security-compliance-certificate.component.html',
  styleUrls: ['./security-compliance-certificate.component.scss']
})
export class SecurityComplianceCertificateComponent implements OnInit {
  @ViewChild('documentChecklistViewLite', {static: true}) documentChecklistViewLite: DocumentChecklistViewLiteComponent;
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

  constructor(protected dialogRef: NbDialogRef<SecurityComplianceCertificateComponent>,
              private creditAdministrationService: CreditAdministrationService,
              private ngbModal: NgbModal,
              private nbDialogService: NbDialogService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private companyInfoService: CompanyInfoService,
              private formBuilder: FormBuilder,
              private spinnerService: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    console.log('productUtil', LocalStorageUtil.getStorage().productUtil);
    if (!ObjectUtil.isEmpty(this.cadFile.sccData)) {
      this.sccData = JSON.parse(this.cadFile.sccData);
      console.log('sccData', this.sccData);
    }
    // this.documentChecklistViewLite.onSubmit();
    // this.documentCheckListData = JSON.stringify(this.documentChecklistViewLite.submitData);
    // console.log('Document Checklist Data:', this.documentChecklistViewLite.submitData);
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
    this.buildSccForm();
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
      cibObtained: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.cibObtained) ? new Date() :
              new Date(this.sccData.cibObtained)],
      strObtained: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.strObtained) ? new Date() :
              new Date(this.sccData.strObtained)],
      iffObtained: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.iffObtained) ? new Date() :
              new Date(this.sccData.iffObtained)],
      kyc: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.kyc) ? new Date() :
              new Date(this.sccData.kyc)],
      declaration: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.declaration) ? new Date() :
              new Date(this.sccData.declaration)],
      caApproved: [ObjectUtil.isEmpty(this.sccData) ? new Date() :
          ObjectUtil.isEmpty(this.sccData.caApproved) ? new Date() :
              new Date(this.sccData.caApproved)],
      baseII: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.baseII) ? undefined : this.sccData.baseII],
      nrbSector: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.nrbSector) ? undefined : this.sccData.nrbSector],
      naics: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.naics) ? undefined : this.sccData.naics],
      industry: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.industry) ? undefined : this.sccData.industry],
      customerCode: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.customerCode) ? undefined : this.sccData.customerCode],
      businessUnit: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.businessUnit) ? undefined : this.sccData.businessUnit],
      esrm: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.esrm) ? undefined : this.sccData.esrm],
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
      drawDownNTA: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.drawDownNTA) ? undefined : this.sccData.drawDownNTA],
      drawDownFMV: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.drawDownFMV) ? undefined : this.sccData.drawDownFMV],
      drawDownTax: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.drawDownTax) ? undefined : this.sccData.drawDownTax],
      obtained: [ObjectUtil.isEmpty(this.sccData) ? undefined :
          ObjectUtil.isEmpty(this.sccData.obtained) ? undefined : this.sccData.obtained],
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
    });
  }

  getCompanyPan() {
    if (!ObjectUtil.isEmpty(this.cadFile) && this.cadFile.loanHolder.customerType === this.customerType.INSTITUTION) {
      this.companyInfoService.detail(this.cadFile.loanHolder.associateId).subscribe((res: any) => {
        this.panNumber = res.detail.panNumber;
      });
    }
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
    if (this.sumbit) {
      this.cadFile.sccData = JSON.stringify(this.sccForm.value);
      this.documentChecklistViewLite.onSubmit();
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
      }, error => {
        console.log(error);
        this.spinnerService.hide();
        this.spinner = false;
        this.toastService.show(new Alert(AlertType.ERROR, error));
      });
    }
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

}
