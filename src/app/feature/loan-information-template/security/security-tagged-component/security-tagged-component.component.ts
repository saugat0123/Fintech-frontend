import {Component, Input, OnInit} from '@angular/core';
import {SecurityLoanReference} from '../../../modal/security-loan-reference';

@Component({
  selector: 'app-security-tagged-component',
  templateUrl: './security-tagged-component.component.html',
  styleUrls: ['./security-tagged-component.component.scss']
})
export class SecurityTaggedComponentComponent implements OnInit {

  constructor() { }

  @Input() tagged: Array<SecurityLoanReference>;
  @Input() security;
  ngOnInit() {
  }

}
