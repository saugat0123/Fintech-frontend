import {Component, Input, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-security-compliance-certificate',
  templateUrl: './security-compliance-certificate.component.html',
  styleUrls: ['./security-compliance-certificate.component.scss']
})
export class SecurityComplianceCertificateComponent implements OnInit {
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



  constructor(protected dialogRef: NbDialogRef<SecurityComplianceCertificateComponent>,
              private creditAdministrationService: CreditAdministrationService,
              private ngbModal: NgbModal,
              private nbDialogService: NbDialogService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private companyInfoService: CompanyInfoService
  ) {
  }

  ngOnInit() {
    this.getCompanyPan();
    this.setSccRefNumber();
    this.getSecurityCode();
    if (this.userType === RoleType.MAKER) {
      this.isMaker = true;
    }
  }

  getCompanyPan() {
    if (!ObjectUtil.isEmpty(this.cadFile) && this.cadFile.loanHolder.customerType === this.customerType.INSTITUTION) {
      this.companyInfoService.detail(this.cadFile.loanHolder.associateId).subscribe((res: any) => {
        this.panNumber = res.detail.panNumber;
      });
    }
  }

  setSccRefNumber() {
    if (!ObjectUtil.isEmpty(this.cadFile.exposure)) {
      const exposureHistoryData = JSON.parse(this.cadFile.exposure.historyData);
      this.sccRefNumber = String().concat(this.affiliatedId.toString()).concat('-cad-').concat(this.cadFile.id.toString()).concat('-dis-').concat(exposureHistoryData ? exposureHistoryData.length : 0);
    }
  }


  onClose() {
    this.dialogRef.close();
  }

  openDocUploadModal(modal) {
    this.ngbModal.open(modal);
  }

  uploadDoc(event) {
    this.uploadFile = event.target.files[0];
  }

  save() {
    this.spinner = true;
    const formData: FormData = new FormData();
    formData.append('file', this.uploadFile);
    formData.append('customerInfoId', this.cadFile.loanHolder.id.toString());
    formData.append('cadId', this.cadFile.id.toString());
    formData.append('docName', new Date().toString());
    formData.append('branchId', this.cadFile.loanHolder.branch.id.toString());
    if (ObjectUtil.isEmpty(this.cadFile.exposure)) {
      this.spinner= false;
      this.modelClose();
      this.toastService.show(new Alert(AlertType.WARNING, 'Exposure details are missing'));
      return;
    }
    this.creditAdministrationService.getSccDocPath(formData).subscribe((res: any) => {
      const mergeData = {
        disbursementDetails: this.cadFile.exposure ? JSON.parse(this.cadFile.exposure.data).disbursementDetails : {},
        sccPath: res.detail
      };
      this.cadFile.exposure.data = JSON.stringify(mergeData);
      this.creditAdministrationService.saveCadDocumentBulk(this.cadFile).subscribe((response: any) => {
        this.modelClose();
        this.onClose();
        this.spinner= false;
        this.routerUtilsService.reloadCadProfileRouteWithActiveTab(this.cadFile.id, 0);
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully upload SCC File'));
      }, error => {
        this.modelClose();
        this.spinner= false;
        console.log(error);
        this.toastService.show(new Alert(AlertType.ERROR, error));
      });
    }, error => {
      console.log(error);
      this.spinner= false;
      this.toastService.show(new Alert(AlertType.ERROR, error));
    });
  }

  modelClose() {
    this.ngbModal.dismissAll();
  }

  getSecurityCode() {
    if ( !ObjectUtil.isEmpty(this.cadFile) && !ObjectUtil.isEmpty(this.cadFile.data)) {
     const accountData = JSON.parse(this.cadFile.data);
     if (!ObjectUtil.isEmpty(accountData)) {
       this.securityCode = ObjectUtil.separateFirstDash(accountData.acInfo.securityType);
     }
   }
  }


}
