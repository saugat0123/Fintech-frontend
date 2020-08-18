import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SiteVisitComponent} from '../../../loan-information-template/site-visit/site-visit.component';
import {TemplateName} from '../../model/templateName';
import {CustomerInfoService} from '../../service/customer-info.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
// @ts-ignore
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {SiteVisit} from '../../../admin/modal/siteVisit';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Security} from '../../../loan/model/security';
import {CalendarType} from '../../../../@core/model/calendar-type';

@Component({
  selector: 'app-customer-loan-information',
  templateUrl: './customer-loan-information.component.html',
  styleUrls: ['./customer-loan-information.component.scss']
})
export class CustomerLoanInformationComponent implements OnInit {

  @Input() id: number;
  @Input() customerInfo: CustomerInfoData;
  s = new SiteVisit();
  security = new Security();
  @ViewChild('siteVisit', {static: false})
  siteVisit: SiteVisitComponent;
  calendarType: CalendarType = CalendarType.AD;


  constructor(private toastService: ToastService, private customerInfoService: CustomerInfoService) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerInfo.siteVisit)) {
      this.s = this.customerInfo.siteVisit;
    }

  }

  saveSiteVisit(event) {
    this.s.data = event;
    this.customerInfoService.saveLoanInfo(this.s, this.id, TemplateName.SITE_VISIT).subscribe((response: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved site visit!'));

    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save site visit!'));
    });


  }

  saveSecurity(event) {
    this.security.data = event;
    this.customerInfoService.saveLoanInfo(this.security, this.id, TemplateName.SECURITY).subscribe((response: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Security Data!'));

    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Security Data!'));
    });


  }
}
