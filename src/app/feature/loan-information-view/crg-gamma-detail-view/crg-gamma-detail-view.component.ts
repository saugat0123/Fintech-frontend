import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanDataHolder} from '../../loan/model/loanData';

@Component({
  selector: 'app-crg-gamma-detail-view',
  templateUrl: './crg-gamma-detail-view.component.html',
  styleUrls: ['./crg-gamma-detail-view.component.scss']
})
export class CrgGammaDetailViewComponent implements OnInit {

  @Input() formData: any;
  @Input() loanHolderData: LoanDataHolder;
  @Input() landSecurityDetails;
  @Input() creditHistory: number;
  crgGammaList = [];
  crgGammaData;
  spinner = false;
  questionList = [];
  questionAnsMap: Map<string, number>;
  Object = Object;
  constructor(
      private modalService: NgbModal,
  ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formData) && this.formData) {
      this.crgGammaData = this.formData.data ? JSON.parse(this.formData.data) : this.formData.data;
      // this.crgGammaList.push();
        if (this.crgGammaData.groupObject[this.creditHistory].length > 0) {
          this.crgGammaData.groupObject[this.creditHistory].forEach(ga => {
            this.crgGammaList.push(ga);
          });
        }
      this.crgGammaList.forEach(cg => {
        const ansMap = new Map<string, number>();
        this.questionAnsMap = new Map<string, number>();
        for (const [key, value] of Object.entries(cg.gammaQuestionAnswer)) {
          ansMap.set(key, Number(value));
        }
        this.questionList.push(ansMap);
      });
    }
  }

  onClose() {
    this.modalService.dismissAll();
  }
}
