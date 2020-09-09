import {Component, Input, OnInit} from '@angular/core';
import {SiteVisit} from '../../../../../admin/modal/siteVisit';

@Component({
  selector: 'app-site-visit-details',
  templateUrl: './site-visit-details.component.html',
  styleUrls: ['./site-visit-details.component.scss']
})
export class SiteVisitDetailsComponent implements OnInit {
@Input() siteVisitData: SiteVisit;
  constructor() { }

  ngOnInit() {
  }

}
