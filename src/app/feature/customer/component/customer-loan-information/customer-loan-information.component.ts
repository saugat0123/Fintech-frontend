import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SiteVisitComponent} from '../../../loan-information-template/site-visit/site-visit.component';
import {TemplateName} from '../../model/templateName';
import {CustomerInfoService} from '../../service/customer-info.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {SiteVisit} from '../../../admin/modal/siteVisit';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NbAccordionItemComponent} from '@nebular/theme';

@Component({
  selector: 'app-customer-loan-information',
  templateUrl: './customer-loan-information.component.html',
  styleUrls: ['./customer-loan-information.component.scss']
})
export class CustomerLoanInformationComponent implements OnInit {

  @Input() public customerInfoId: number;
  @Input() public customerInfo: CustomerInfoData;
  @ViewChild('siteVisitComponent', {static: false})
  public siteVisitComponent: SiteVisitComponent;
  @ViewChild('itemSiteVisit', {static: false})
  private itemSiteVisit: NbAccordionItemComponent;
  @Output() public triggerCustomerRefresh = new EventEmitter<boolean>();

  private siteVisit: SiteVisit;

  constructor(
      private toastService: ToastService,
      private customerInfoService: CustomerInfoService
  ) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerInfo.siteVisit)) {
      this.siteVisit = this.customerInfo.siteVisit;
    }
  }

  public saveSiteVisit(data: string) {
    if (ObjectUtil.isEmpty(this.siteVisit)) {
      this.siteVisit = new SiteVisit();
    }
    this.siteVisit.data = data;
    this.customerInfoService.saveLoanInfo(this.siteVisit, this.customerInfoId, TemplateName.SITE_VISIT)
    .subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved site visit!'));
      this.itemSiteVisit.close();
      this.triggerCustomerRefresh.emit(true);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save site visit!'));
    });
  }
}
