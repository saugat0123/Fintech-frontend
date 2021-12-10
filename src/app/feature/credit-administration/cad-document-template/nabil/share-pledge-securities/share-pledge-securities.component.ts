import {Component, Input, OnInit} from '@angular/core';
import {SecurityDetails} from "../securities-view/model/securities-details.model";
import {EngToNepaliNumberPipe} from "../../../../../@core/pipe/eng-to-nepali-number.pipe";

@Component({
  selector: 'app-share-pledge-securities',
  templateUrl: './share-pledge-securities.component.html',
  styleUrls: ['./share-pledge-securities.component.scss']
})
export class SharePledgeSecuritiesComponent implements OnInit {
  @Input() securityDetails;

  constructor(public engToNepaliNumberPipe: EngToNepaliNumberPipe) { }

  ngOnInit() {
  }

}
