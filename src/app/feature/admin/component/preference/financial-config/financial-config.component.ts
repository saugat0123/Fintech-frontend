import {Component, OnInit} from '@angular/core';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {FinancialConfigModalComponent} from './financial-config-modal/financial-config-modal.component';
import {FiscalYear} from '../../../modal/FiscalYear';
import {FiscalYearService} from '../../../service/fiscal-year.service';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Router} from '@angular/router';

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
              private fiscalYearService: FiscalYearService,
              private router: Router
              ) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.fiscalYearService.getPaginationWithSearchObject({}, this.page, 10).subscribe(response => {
      this.fiscalYears = response.detail.content;
      this.pageable = PaginationUtils.getPageable(response.detail);
      this.spinner = false;
    }, error => {
      if (error.status === 403) {
        this.router.navigate(['/home/error']);
      } else {
        this.toastService.show(new Alert(AlertType.SUCCESS, 'failed to load fiscal years'));
      }
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
