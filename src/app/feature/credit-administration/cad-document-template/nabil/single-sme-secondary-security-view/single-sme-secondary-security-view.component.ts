import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-single-sme-secondary-security-view',
  templateUrl: './single-sme-secondary-security-view.component.html',
  styleUrls: ['./single-sme-secondary-security-view.component.scss']
})
export class SingleSmeSecondarySecurityViewComponent implements OnInit {
  @Input() securityDetails;

  constructor() { }

  ngOnInit() {
  }

}
