import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-master-securities-view',
  templateUrl: './master-securities-view.component.html',
  styleUrls: ['./master-securities-view.component.scss']
})
export class MasterSecuritiesViewComponent implements OnInit {
  @Input() securityDetails;

  constructor() { }

  ngOnInit() {
  }

}
