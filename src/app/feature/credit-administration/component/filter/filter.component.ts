import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Branch} from '../../../admin/modal/branch';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {ToastService} from '../../../../@core/utils';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  isFilterCollapsed = true;
  filterForm: FormGroup;
  branchList: Array<Branch> = new Array<Branch>();
  @Output() eventEmitter = new EventEmitter();

  constructor(private branchService: BranchService,
              private toastService: ToastService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildFilterForm();

    this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
      this.branchList = response.detail;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
    });
  }

  buildFilterForm() {
    this.filterForm = this.formBuilder.group({
      name: [undefined],
      customerType: [undefined],
      branchIds: [undefined],
    });
  }

  onSearch() {
    this.eventEmitter.emit(this.filterForm.value);
  }

  clear() {
    this.filterForm.reset();
    this.eventEmitter.emit(this.filterForm.value);

  }

}
