import {Component, OnInit} from '@angular/core';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {FinancialConfigModalComponent} from './financial-config-modal/financial-config-modal.component';
import {FiscalYear} from '../../../modal/FiscalYear';
import {FiscalYearService} from '../../../service/fiscal-year.service';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
  selector: 'app-financial-config',
  templateUrl: './financial-config.component.html',
  styleUrls: ['./financial-config.component.scss']
})
export class FinancialConfigComponent implements OnInit {
  fiscalYears: Array<FiscalYear> = [];

  spinner = false;
  pageable: Pageable = new Pageable();
  page = 1;

  constructor(private toastService: ToastService,
              private dialogService: NbDialogService,
              private fiscalYearService: FiscalYearService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.fiscalYearService.getPaginationWithSearchObject({}, 1, 5).subscribe(response => {
      this.fiscalYears = response.detail.content;
      this.pageable = PaginationUtils.getPageable(response.detail);
      this.spinner = false;
    }, error => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'failed to load fiscal years'));
      this.spinner = false;
    });
  }

  openFinancialConfigModal(fiscalYear) {
    this.dialogService.open(FinancialConfigModalComponent, {context: {fiscalYear}}).onClose.subscribe(() => this.loadData());
  }

  changePage(page: number) {
    this.page = page;
    this.loadData();
  }

  editFiscalYear(fiscalYear) {
    this.openFinancialConfigModal(fiscalYear);
  }
}
