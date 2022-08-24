import {Component, Input, OnInit} from '@angular/core';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-crg-gamma-detail-view',
  templateUrl: './crg-gamma-detail-view.component.html',
  styleUrls: ['./crg-gamma-detail-view.component.scss']
})
export class CrgGammaDetailViewComponent implements OnInit {

  @Input() formData;
  @Input() customerInfoId;
  crgGammaList = [];
  crgGammaData;
  previousCrgGammaData;
  customerLoan: LoanDataHolder;

  constructor(private customerLoanService: LoanFormService) { }

  ngOnInit() {
    this.crgGammaData = JSON.parse(this.formData.data);
    if (!ObjectUtil.isEmpty(this.customerInfoId)) {
      this.getAllCustomerLoans();
    }
    // for (const [key, value] of Object.entries(this.crgGammaData)) {
    //   const ansModel = {
    //     question: null,
    //     answer: null,
    //     score: null,
    //   };
    //   if (!(key.includes(`Parameter`) || key === `totalPoint` || key === `grade`)) {
    //     ansModel.question = key;
    //     ansModel.answer = this.crgGammaData[`${key}Parameter`];
    //     ansModel.score = value;
    //
    //     this.crgGammaList.push(ansModel);
    //   }
    // }
  }

  getAllCustomerLoans() {
    this.customerLoanService.getLoansByLoanHolderId(this.customerInfoId).subscribe({
      next: (res: any) => {
        // tslint:disable-next-line:max-line-length
        const approvedLoanList: LoanDataHolder [] = (res.detail as LoanDataHolder []).filter(d => d.documentStatus.toString() === 'APPROVED');
        this.customerLoan = approvedLoanList[approvedLoanList.length - 1];
      },
      error: (err) => {

      },
      complete: () => {
        if (!ObjectUtil.isEmpty(this.customerLoan.loanHolder.crgGamma.data)) {
          this.previousCrgGammaData = JSON.parse(this.customerLoan.loanHolder.crgGamma.data);
          console.log('this is latest data', this.previousCrgGammaData);
        }
      }
    });
  }
}
