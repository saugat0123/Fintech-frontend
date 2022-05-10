import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../../loan/model/security';

@Component({
  selector: 'app-security-tagged-common',
  templateUrl: './security-tagged-common.component.html',
  styleUrls: ['./security-tagged-common.component.scss']
})
export class SecurityTaggedCommonComponent implements OnInit {

  @Input() security: Security;
  constructor() { }

  ngOnInit() {
  }

}
