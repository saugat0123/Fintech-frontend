import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CreditAdministrationService} from '../service/credit-administration.service';
import {PaginationUtils} from '../../../@core/utils/PaginationUtils';
import {MegaOfferLetterConst} from '../mega-offer-letter-const';

@Component({
  selector: 'app-cad-offerletter-profile',
  templateUrl: './cad-offerletter-profile.component.html',
  styleUrls: ['./cad-offerletter-profile.component.scss']
})
export class CadOfferLetterProfileComponent implements OnInit {


  constructor(
      private activatedRoute: ActivatedRoute,
      private service: CreditAdministrationService,
  ) { }
  spinner = false;
  offerLetterId;
  loanHolderId;
  cadOfferLetterApprovedDoc;
  offerLetterTypes = MegaOfferLetterConst.enumObject();

  static loadData(other: CadOfferLetterProfileComponent) {
    other.spinner = true;
    other.service.detail(other.offerLetterId).subscribe((res: any) => {
      other.cadOfferLetterApprovedDoc = res.detail;
      console.log(res.detail);
      other.spinner = false;
    } , error => {
      console.log(error);
      other.spinner = false;
    });
  }

  ngOnInit() {
    console.log(this.offerLetterTypes);
    this.offerLetterId = Number(this.activatedRoute.snapshot.queryParamMap.get('offerLetterId'));
    this.loanHolderId = Number(this.activatedRoute.snapshot.queryParamMap.get('loanHolderId'));
    CadOfferLetterProfileComponent.loadData(this);
  }

}
