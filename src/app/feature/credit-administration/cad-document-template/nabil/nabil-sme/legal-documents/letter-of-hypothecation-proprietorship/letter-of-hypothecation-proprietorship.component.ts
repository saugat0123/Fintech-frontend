import { Component, OnInit, Input } from '@angular/core';
import { CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-letter-of-hypothecation-proprietorship',
  templateUrl: './letter-of-hypothecation-proprietorship.component.html',
  styleUrls: ['./letter-of-hypothecation-proprietorship.component.scss']
})
export class LetterOfHypothecationProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  constructor() { }

  ngOnInit() {
  }

}
