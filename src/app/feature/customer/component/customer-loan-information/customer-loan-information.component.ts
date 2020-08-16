import {Component, OnInit, ViewChild} from '@angular/core';
import {NbDialogService} from '@nebular/theme';
import {SiteVisitComponent} from '../../../loan-information-template/site-visit/site-visit.component';

@Component({
  selector: 'app-customer-loan-information',
  templateUrl: './customer-loan-information.component.html',
  styleUrls: ['./customer-loan-information.component.scss']
})
export class CustomerLoanInformationComponent implements OnInit {

  @ViewChild('siteVisit', {static: false})
  siteVisit: SiteVisitComponent;

  constructor(private dialogService: NbDialogService, ) {
  }

  ngOnInit() {
  }

  saveSiteVisit(event) {
    console.log(event);
  }
}
