import { Component, OnInit } from '@angular/core';
import {LoanDataHolder} from '../../model/loanData';
import {ActivatedRoute} from '@angular/router';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFormService} from '../loan-form/service/loan-form.service';
import {ToastService} from '../../../../@core/utils';

@Component({
  selector: 'app-offer-letter',
  templateUrl: './offer-letter.component.html',
  styleUrls: ['./offer-letter.component.scss']
})
export class OfferLetterComponent implements OnInit {
  loanDataHolder: LoanDataHolder;
  customerId: number;


  constructor(
      private activatedRoute: ActivatedRoute,
      private loanFormService: LoanFormService,
      private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.customerId = Number(this.activatedRoute.snapshot.queryParamMap.get('customerId'));
    this.loanFormService.detail(this.customerId).subscribe((response: any) => {
      this.loanDataHolder = response.detail;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Error loading loan information.'));
    });
  }

}
