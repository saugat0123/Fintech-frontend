import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../service/customer.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {ToastService} from '../../../../@core/utils';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanType} from '../../../loan/model/loanType';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerFormComponent} from '../customer-form/individual-form/customer-form.component';
import {NbDialogService} from '@nebular/theme';
import {CustomerInfoService} from '../../service/customer-info.service';
import {CustomerType} from '../../model/customerType';
import {CompanyFormComponent} from '../customer-form/company-form/company-form.component';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {RoleType} from '../../../admin/modal/roleType';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {NgxSpinnerService} from 'ngx-spinner';
import {District} from '../../../admin/modal/district';
import {AddressService} from '../../../../@core/service/baseservice/address.service';
import {Branch} from '../../../admin/modal/branch';
import {RoleAccess} from '../../../admin/modal/role-access';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-customer-component',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  page = 1;
  spinner = false;
  search = {};
  customerList = [];
  pageable: Pageable = new Pageable();
  isFilterCollapsed = true;
  filterForm: FormGroup;
  loanType = LoanType;
  customerType;
  currentRoleTypeMaker = false;
  allDistrict: Array<District> = Array<District>();
  branchList: Array<Branch> = new Array<Branch>();
  roleAccess: string;
  isMaker = false;

  accessSpecific: boolean;
  accessAll: boolean;
  showBranch = true;
  holdBranch = [];

  constructor(private customerService: CustomerService,
              private toastService: ToastService,
              private modalService: NgbModal,
              private dialogService: NbDialogService,
              private customerLoanService: LoanFormService,
              private router: Router,
              private formBuilder: FormBuilder,
              private customerInfoService: CustomerInfoService,
              private overlay: NgxSpinnerService,
              private commonLocation: AddressService,
              private branchService: BranchService,
  ) {
  }

  static loadData(other: CustomerComponent) {
    other.overlay.show();
    other.spinner = true;
    other.customerInfoService.getPaginationWithSearchObject(other.filterForm.value, other.page, 10).subscribe((response: any) => {
      other.customerList = response.detail.content;
      other.pageable = PaginationUtils.getPageable(response.detail);
      other.spinner = false;
      other.overlay.hide();

    }, error => {
      console.error(error);
      other.overlay.hide();
      other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Customer!'));
      other.spinner = false;

    });
    other.filterForm.get('tempBranch').patchValue(other.holdBranch);
  }

  ngOnInit() {
    this.buildFilterForm();
    CustomerComponent.loadData(this);
    this.getAllDistrict();
    this.getBranch();
    const roleType: string = LocalStorageUtil.getStorage().roleType;
    this.currentRoleTypeMaker = roleType === RoleType.MAKER;
  }

  buildFilterForm() {
    this.filterForm = this.formBuilder.group({
      name: [undefined],
      customerType: [undefined],
      idRegPlace: [undefined],
      tempBranch: [undefined],
      branchIds: [undefined]
    });
  }

  private getAllDistrict() {
    this.commonLocation.getAllDistrict().subscribe((response: any) => {
      this.allDistrict = response.detail;
    });
  }

  changePage(page: number) {
    delete this.filterForm.value.tempBranch;
    this.page = page;
    CustomerComponent.loadData(this);
  }

  /* associate id is customer or company id*/
  customerProfile(associateId, id, customerType) {
    if (CustomerType[customerType] === CustomerType.INDIVIDUAL) {
      this.router.navigate(['/home/customer/profile/' + associateId], {queryParams: {customerType: customerType, customerInfoId: id}});
    } else if (CustomerType[customerType] === CustomerType.COMPANY) {
      this.router.navigate(['/home/customer/company-profile/' + associateId],
          {queryParams: {id: id, customerType: customerType, companyInfoId: associateId, customerInfoId: id}});
    }
  }

  onSearch() {
    this.branchArrayToString();
    CustomerComponent.loadData(this);
  }


  getForm() {
    this.onClose();
    if (CustomerType.INDIVIDUAL === CustomerType[this.customerType]) {
      this.dialogService.open(CustomerFormComponent).onClose.subscribe(res => CustomerComponent.loadData(this));
    } else if (CustomerType.COMPANY === CustomerType[this.customerType]) {
      this.dialogService.open(CompanyFormComponent).onClose.subscribe(res => CustomerComponent.loadData(this));
    }
  }

  openTemplate(template) {
    this.modalService.open(template);
  }

  onClose() {
    this.modalService.dismissAll();
  }

  clear() {
    this.holdBranch = [];
    this.filterForm.get('tempBranch').patchValue(this.holdBranch);
    this.buildFilterForm();
    CustomerComponent.loadData(this);

  }

  download() {
    this.overlay.show();
    this.branchArrayToString();
    this.customerInfoService.download(this.filterForm.value).subscribe((response: any) => {
      this.overlay.hide();
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = ApiConfig.URL + '/' + response.detail;
      link.download = name;
      link.setAttribute('visibility', 'hidden');
      link.click();
    }, error => {
      this.overlay.hide();
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Download Customer!'));
    });
    this.filterForm.get('tempBranch').patchValue(this.holdBranch);
  }


  getBranch() {
    this.roleAccess = LocalStorageUtil.getStorage().roleAccess;
    if (LocalStorageUtil.getStorage().roleType === RoleType.MAKER) {
      this.isMaker = true;
    }
    if (this.roleAccess === RoleAccess.SPECIFIC) {
      this.accessSpecific = true;
    } else if (this.roleAccess === RoleAccess.ALL) {
      this.accessAll = true;
    }
    if (this.roleAccess === RoleAccess.OWN) {
      this.showBranch = false;
    }

    if (this.accessSpecific || this.accessAll) {
      this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
        this.branchList = response.detail;
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
      });
    }

  }

  branchArrayToString() {
    const branches: Array<number> = this.filterForm.get('tempBranch').value;
    if (!ObjectUtil.isEmpty(branches) && branches.length > 0) {
      this.holdBranch = branches;
      this.filterForm.get('branchIds').patchValue(branches.join(','));
    } else {
      delete this.filterForm.value.branchIds;
    }
    delete this.filterForm.value.tempBranch;
  }


}
