import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Branch} from '../../../admin/modal/branch';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {ToastService} from '../../../../@core/utils';
import {CadDocStatus} from '../../model/CadDocStatus';
import {UserService} from '../../../../@core/service/user.service';
import {RoleType} from '../../../admin/modal/roleType';
import {User} from '../../../admin/modal/user';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {ApprovalRoleHierarchyService} from '../../../loan/approval/approval-role-hierarchy.service';
import {Role} from '../../../admin/modal/role';
import {ApprovalRoleHierarchy} from '../../../loan/approval/ApprovalRoleHierarchy';
import {RoleAccess} from '../../../admin/modal/role-access';
import {CustomerService} from '../../../admin/service/customer.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CadReportComponent} from '../cad-report/cad-report.component';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {CadOfferLetterConfigurationComponent} from '../../cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NbDialogService} from '@nebular/theme';
import {Customer} from '../../../admin/modal/customer';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {GuarantorDetail} from '../../../loan/model/guarantor-detail';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  isFilterCollapsed = true;
  filterForm: FormGroup;
  branchList: Array<Branch> = new Array<Branch>();
  cadDocStatus = CadDocStatus.key();
  role = RoleType;
  possessionUnderUserList: Array<User>;
  showPossessionUnder = false;
  @Output() eventEmitter = new EventEmitter();
  @Input() fromCadDashboard;
  @Input() docStatus;
  @Input() isDefaultCADROLEFILTER: boolean;
  possessionRoleList: Array<Role>;
  branchAccessIsOwn = false;
  clientType = [];
  customerInfoData = new CustomerInfoData();
  cadOfferLetterApprovedDoc = new CustomerApprovedLoanCadDocumentation();
  customerInfo = new Customer();
  constructor(private branchService: BranchService,
              private toastService: ToastService,
              private nbDialogService: NbDialogService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private routerUtils: RouterUtilsService,
              private service: ApprovalRoleHierarchyService,
              private customerService: CustomerService,
              private modalService: NgbModal
  ) {
  }

  ngOnInit() {

    this.buildFilterForm();
    this.userService.getLoggedInUser().subscribe(res => {
      if (res.detail.role.roleType === RoleType.CAD_ADMIN || res.detail.role.roleType === RoleType.CAD_SUPERVISOR) {
        this.showPossessionUnder = true;
        this.getCadRoleList();
      }
      if (res.detail.role.roleAccess === RoleAccess.OWN) {
        this.branchAccessIsOwn = true;
      } else {
        this.branchAccessIsOwn = false;
      }
      if (res.detail.role.roleType === RoleType.CAD_SUPERVISOR) {
        const idList = [];
        res.detail.provinces.forEach(value => {
          idList.push(value);
        });
        this.branchService.getBranchByProvinceList(idList).subscribe((branchLists: any) => {
          this.branchList = branchLists.detail;
        });
      } else {
        this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
          this.branchList = response.detail;
        }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
        });
      }
    });
    this.getClientType();

  }

  buildFilterForm() {
    this.filterForm = this.formBuilder.group({
      name: [undefined],
      customerType: [undefined],
      branchIds: [undefined],
      toUser: undefined,
      docStatus: undefined,
      toRole: undefined,
      clientType: undefined
    });
  }

  onSearch() {
    this.eventEmitter.emit(this.filterForm.value);
  }

  clear() {
    this.filterForm.reset();
    this.eventEmitter.emit(this.filterForm.value);

  }

  getUserList() {
    this.userService.getAllUserByCurrentRoleBranchAccess().subscribe((value: any) => {
      this.possessionUnderUserList = value.detail;
    });

  }

  getCadRoleList() {
    const approvalType = 'CAD';
    const refId = 0;

    this.service.findAll(approvalType, refId).subscribe((response: any) => {
      let approvalList: ApprovalRoleHierarchy[] = [];
      approvalList = response.detail;
      this.possessionRoleList = approvalList.map(a => a.role);
      if (this.isDefaultCADROLEFILTER && LocalStorageUtil.getStorage().roleType === RoleType.CAD_ADMIN) {
        const r: Role = this.possessionRoleList.filter(c => c.roleName === 'CAD')[0];
        this.filterForm.patchValue({
          toRole: r.id
        });
      }
    });

  }

  getReport() {
    this.routerUtils.generateReport(this.filterForm.value, this.docStatus, this.fromCadDashboard);
  }

  getClientType() {
    this.customerService.clientType().subscribe((res: any) => {
          this.clientType = res.detail;

        }
        , error => {
          console.error(error);
        });
  }

  openReport() {
    this.modalService.open(CadReportComponent, {size: 'xl'});
  }

  openOfferLetterConfigModal() {
    this.nbDialogService.open(CadOfferLetterConfigurationComponent, {
      context: {
        cadData: this.cadOfferLetterApprovedDoc,
        customerInfo: this.customerInfoData,
        customer: this.customerInfo,
      }
    }).onClose
        .subscribe(value => {
          if (!ObjectUtil.isEmpty(value)) {
            this.customerInfoData = value;
            console.log(value);
          }
        });
  }
}
