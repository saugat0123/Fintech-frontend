import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../../../../@core/service/common.service';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Exposure} from '../../../model/Exposure';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {AdditionalDocument} from '../../../model/AdditionalDocument';
import {RoleType} from '../../../../admin/modal/roleType';

@Component({
  selector: 'app-additional-exposure',
  templateUrl: './additional-exposure.component.html',
  styleUrls: ['./additional-exposure.component.scss']
})
export class AdditionalExposureComponent implements OnInit, OnChanges {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() isHistory: boolean;
  customerLoanList: Array<LoanDataHolder>;

  @Output()
  responseCadData: EventEmitter<CustomerApprovedLoanCadDocumentation> = new EventEmitter<CustomerApprovedLoanCadDocumentation>();

  // todo replace with api from backend predefined data
  frequencyList = ['Semi-Annually', 'Quarterly', 'Monthly', 'Bullet', 'Ballooning'];

  spinner = false;
  exposureForm: FormGroup;
  details = [];
  docScc;
  @Input() additionalDocument: AdditionalDocument;
  addDocForm: FormGroup;

  disableAdd = false;
  cadRoleList = [];
  disbursementComment;
  toRole;
  loadCurrentDisbursement = false;

  constructor(private formBuilder: FormBuilder,
              private routerUtilsService: RouterUtilsService,
              private service: CreditAdministrationService,
              private toastService: ToastService,
              private modalService: NgbModal,
              public commonService: CommonService,
              private creditAdministrationService: CreditAdministrationService) {
  }

  get disbursementDetails() {
    return this.exposureForm.get('disbursementDetails') as FormArray;
  }

  get totalLimit() {
    let t = 0;
    this.disbursementDetails.controls.forEach(value => t += Number(value.get('loanLimit').value));
    return t;
  }

  ngOnInit() {
    this.creditAdministrationService.getRoleInCad().subscribe(value => {
      this.cadRoleList = value.detail;
      this.cadRoleList = this.cadRoleList.filter(value1 => value1.role.roleType !== RoleType.MAKER);
      this.toRole = this.cadRoleList.filter(value1 => value1.role.roleName === 'CAD')[0].role.id;
    });
    this.initial();
    this.buildDocForm();
  }

  buildDocForm() {
    this.addDocForm = this.formBuilder.group({
      additionalDoc: this.formBuilder.array([])
    });
  }

  addDoc() {
    this.disableAdd = true;
    (this.addDocForm.get('additionalDoc') as FormArray).push(
        this.formBuilder.group({
          id: [undefined],
          docName: [undefined, [Validators.required]],
          docPath: [undefined, Validators.required],
          uploadOn: [undefined],
          remarks: [undefined],
          version: [undefined]
        })
    );
  }

  removeDoc(index: number) {
    this.disableAdd = false;
    (this.addDocForm.get('additionalDoc') as FormArray).removeAt(index);
  }

  initial() {
    this.spinner = true;
    if (!ObjectUtil.isEmpty(this.cadData)) {
      this.customerLoanList = this.cadData.assignedLoan;
    }
    this.buildForm();
    this.creditAdministrationService.detail(this.cadData.id).subscribe((res: any) => {
      this.loadCurrentDisbursement = true;
      this.cadData = res.detail;
      if (!ObjectUtil.isEmpty(this.cadData.exposure) && !ObjectUtil.isEmpty(this.cadData.exposure.data) && !this.isHistory) {
        this.setDisbursementDetails();
        const d = JSON.parse(this.cadData.exposure.data);

        if (!ObjectUtil.isEmpty(d.sccPath)) {
          this.docScc = d.sccPath;
        }
      } else {
        this.addDisbursementDetail();
      }
      this.spinner = false;
    }, error => this.spinner = false);
  }

  buildForm() {
    this.exposureForm = this.formBuilder.group({
      disbursementDetails: this.formBuilder.array([])
    });
  }

  addDisbursementDetail() {
    this.cadData.assignedLoan.forEach(value => {
      this.disbursementDetails.push(this.formBuilder.group({
        customerLoanId: [value.id],
        loanName: [value.loan.name],
        loanLimit: [value.proposal.proposedLimit, Validators.required],
        disbursement: [undefined, Validators.required],
        initialRate: [undefined, Validators.required],
        maturity: [undefined, Validators.required],
        frequency: [undefined, Validators.required],
        isFunded: [value.loan.isFundable],
        approvedLoanBy: [value.currentStage.docAction.toString() === 'APPROVED' ? value.currentStage.toUser.name : undefined]
      }));
    });
  }

  setDisbursementDetails() {
    let data = [];
    if (!ObjectUtil.isEmpty(this.cadData.exposure.data)) {
      data = JSON.parse(this.cadData.exposure.data).disbursementDetails;
      data.forEach(value => {
        this.disbursementDetails.push(this.formBuilder.group({
          customerLoanId: [ObjectUtil.isEmpty(value.id) ? null : value.id],
          loanName: [value.loanName],
          loanLimit: [value.loanLimit, Validators.required],
          disbursement: [value.disbursement, Validators.required],
          initialRate: [value.initialRate, Validators.required],
          maturity: [value.maturity, Validators.required],
          frequency: [value.frequency, Validators.required],
          isFunded: [value.isFunded],
          approvedLoanBy: [value.approvedLoanBy]
        }));
      });
    }
  }

  submit() {
    let data = [];
    data = this.addDocForm.get('additionalDoc').value;
    this.spinner = true;
    const exposure = new Exposure();
    exposure.data = JSON.stringify(this.exposureForm.value);
    if (!ObjectUtil.isEmpty(this.cadData.exposure)) {
      exposure.id = this.cadData.exposure.id;
      exposure.version = this.cadData.exposure.version;
      let historyData = [];
      if (!ObjectUtil.isEmpty(this.cadData.exposure.historyData)) {
        historyData = JSON.parse(this.cadData.exposure.historyData);
      }
      const tempDisbursementArray = [];
      const sccPath = JSON.parse(this.cadData.exposure.data).sccPath;
      JSON.parse(this.cadData.exposure.data).disbursementDetails.forEach(d => {
        d.approveBy = this.cadData.cadCurrentStage.fromUser.name;
        d.approveByrole = this.cadData.cadCurrentStage.fromRole.roleName;
        d.approvedOn = this.cadData.cadCurrentStage.lastModifiedAt;
        d.sccPath = sccPath;
        tempDisbursementArray.push(d);
      });
      historyData.push(tempDisbursementArray);
      exposure.historyData = JSON.stringify(historyData);
      this.cadData.docStatus = CadDocStatus.DISBURSEMENT_PENDING;
    }
    this.cadData.exposure = exposure;
    data.forEach(value => {
      this.cadData.additionalDocumentList.push(value);
    });
    this.cadData.disbursementComment = this.disbursementComment;
    this.service.saveDisbursementHistory(this.cadData, this.toRole).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Exposure data!!!'));
      // this.routerUtilsService.reloadCadProfileRouteWithActiveTab(this.cadData.id, 1);
      this.responseCadData.emit(res.detail);
      this.spinner = false;
      this.close();
    }, error => {
      console.log(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Exposure data!!!'));
      this.close();
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initial();
  }

  uploadFile(file, index) {
    this.spinner = true;
    const form = (this.addDocForm.get('additionalDoc') as FormArray).at(index).value;

    if (!ObjectUtil.isEmpty(file.target.files[0])) {
      if (ObjectUtil.isEmpty(form.docName)) {
        this.spinner = false;
        this.toastService.show(new Alert(AlertType.INFO, 'Document Name  cannot be empty!!!'));
        return;

      }
      const formData: FormData = new FormData();

      formData.append('file', file.target.files[0]);
      formData.append('cadId', this.cadData.id.toString());
      formData.append('documentName', form.docName.toString());
      formData.append('customerInfoId', this.cadData.loanHolder.id.toString());
      formData.append('branchId', this.cadData.loanHolder.branch.id.toString());
      this.service.uploadAdditionalDocument(formData).subscribe((res: any) => {
        this.spinner = false;
        (this.addDocForm.get('additionalDoc') as FormArray).at(index).patchValue({
          docPath: res.detail,
          uploadOn: new Date()
        });
        this.disableAdd = false;
      });

    }


  }
}
