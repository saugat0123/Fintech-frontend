import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../../../model/security';

@Component({
  selector: 'app-security-details',
  templateUrl: './security-details.component.html',
  styleUrls: ['./security-details.component.scss']
})
export class SecurityDetailsComponent implements OnInit {
  @Input() securityData: Security;

  constructor() { }

  ngOnInit() {
  }

}
