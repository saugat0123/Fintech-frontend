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
import {CustomerFormComponent} from '../individual-customer-form/customer-form.component';
import {NbDialogService} from '@nebular/theme';
import {CustomerInfoService} from '../../service/customer-info.service';
import {CustomerType} from '../../model/customerType';
import {CompanyFormComponent} from '../company-form/company-form.component';

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

  constructor(private customerService: CustomerService,
              private toastService: ToastService,
              private modalService: NgbModal,
              private dialogService: NbDialogService,
              private customerLoanService: LoanFormService,
              private router: Router,
              private formBuilder: FormBuilder,
              private customerInfoService: CustomerInfoService,
  ) {
  }

  static loadData(other: CustomerComponent) {
    other.spinner = true;
    other.customerInfoService.getPaginationWithSearchObject(other.filterForm.value, other.page, 10).subscribe((response: any) => {
      other.customerList = response.detail.content;
      other.pageable = PaginationUtils.getPageable(response.detail);
      other.spinner = false;

    }, error => {
      console.error(error);
      other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Customer!'));
      other.spinner = false;

    });

  }

  ngOnInit() {
    this.buildFilterForm();
    CustomerComponent.loadData(this);
  }

  buildFilterForm() {
    this.filterForm = this.formBuilder.group({

      name: [undefined],


    });
  }


  changePage(page: number) {
    this.page = page;
    CustomerComponent.loadData(this);
  }

  customerProfile(associateId, id, customerType) {

    this.router.navigate(['/home/customer/profile/' + associateId], {queryParams: {customerType: customerType, customerInfoId: id}});
  }

  onSearch() {
    CustomerComponent.loadData(this);

  }

  getCsv() {
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


}
