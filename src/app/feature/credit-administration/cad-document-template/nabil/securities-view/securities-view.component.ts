import { Component, Input, OnInit } from '@angular/core';
import { SecurityDetails } from './model/securities-details.model';

@Component({
  selector: 'app-securities-view',
  templateUrl: './securities-view.component.html',
  styleUrls: ['./securities-view.component.scss']
})
export class SecuritiesComponent implements OnInit {
  @Input() securityDetails: SecurityDetails[] = [];
  
  constructor() { }

  ngOnInit() {
    console.log('securityDetails: ', this.securityDetails);
  }

}
