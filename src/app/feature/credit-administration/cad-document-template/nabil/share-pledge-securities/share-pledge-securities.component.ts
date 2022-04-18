import {Component, Input, OnInit} from '@angular/core';
import {EngToNepaliNumberPipe} from "../../../../../@core/pipe/eng-to-nepali-number.pipe";

@Component({
  selector: 'app-share-pledge-securities',
  templateUrl: './share-pledge-securities.component.html',
  styleUrls: ['./share-pledge-securities.component.scss']
})
export class SharePledgeSecuritiesComponent implements OnInit {
  @Input() securityDetails;
  tempDetails;

  constructor(public engToNepaliNumberPipe: EngToNepaliNumberPipe) { }

  ngOnInit() {
    this.filterSecurity();
  }

  filterSecurity() {
    this.tempDetails = this.securityDetails.secondarySecurity.filter(value => value.securityType
        === 'SHARE_PLEDGE');
  }

}
