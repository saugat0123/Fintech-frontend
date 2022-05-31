import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-master-secondary-securities-view',
  templateUrl: './master-secondary-securities-view.component.html',
  styleUrls: ['./master-secondary-securities-view.component.scss']
})
export class MasterSecondarySecuritiesViewComponent implements OnInit {
  @Input() securityDetails;

  constructor() { }

  ngOnInit() {
  }

}
