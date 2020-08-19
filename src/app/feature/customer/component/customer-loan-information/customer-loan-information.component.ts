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
import {Security} from '../../../loan/model/security';
import {CalendarType} from '../../../../@core/model/calendar-type';

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
  @ViewChild('itemSecurity', {static: false})
  private itemSecurity: NbAccordionItemComponent;
  @Output() public triggerCustomerRefresh = new EventEmitter<boolean>();
  calendarType: CalendarType = CalendarType.AD;
  private siteVisit: SiteVisit;
  private  security: Security;

  constructor(
      private toastService: ToastService,
      private customerInfoService: CustomerInfoService
  ) {
  }

  ngOnInit() {
    console.log(this.customerInfo);
    if (!ObjectUtil.isEmpty(this.customerInfo.siteVisit)) {
      this.siteVisit = this.customerInfo.siteVisit;
    }
    if (!ObjectUtil.isEmpty(this.customerInfo.security)) {
      this.security = this.customerInfo.security;
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

  public saveSecurity(data: string) {
    if (ObjectUtil.isEmpty(this.security)) {
      this.security = new Security();
    }
    this.security.data = data;
    this.customerInfoService.saveLoanInfo(this.security, this.customerInfoId, TemplateName.SECURITY)
    .subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Security Data!'));
      this.itemSecurity.close();
      this.triggerCustomerRefresh.emit(true);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Security Data!'));
    });
  }

}
