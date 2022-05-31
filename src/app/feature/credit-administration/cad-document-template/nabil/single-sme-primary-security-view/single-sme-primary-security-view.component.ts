import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-single-sme-primary-security-view',
  templateUrl: './single-sme-primary-security-view.component.html',
  styleUrls: ['./single-sme-primary-security-view.component.scss']
})
export class SingleSmePrimarySecurityViewComponent implements OnInit {
  @Input() securityDetails;

  constructor() { }

  ngOnInit() {
  }

}
