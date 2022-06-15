import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crg-gamma-detail-view',
  templateUrl: './crg-gamma-detail-view.component.html',
  styleUrls: ['./crg-gamma-detail-view.component.scss']
})
export class CrgGammaDetailViewComponent implements OnInit {

  @Input() formData: any;
  @Input() loanHolderData;
  @Input() landSecurityDetails;
  crgGammaList = [];
  crgGammaData;
  spinner = false;

  constructor(
      private modalService: NgbModal,
  ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formData) && this.formData) {
      this.crgGammaData = this.formData.data ? JSON.parse(this.formData.data) : this.formData.data;
        console.log('crgGammaData', this.crgGammaData);
      for (const [key, value] of Object.entries(this.crgGammaData)) {
        const ansModel = {
          question: null,
          answer: null,
          score: null,
        };
        if (!(key.includes(`Parameter`) || key === `totalPoint` || key === `grade`)) {
          ansModel.question = key;
          ansModel.answer = this.crgGammaData[`${key}Parameter`];
          ansModel.score = value;

          this.crgGammaList.push(ansModel);
        }
      }
    }
  }

  onClose() {
    this.modalService.dismissAll();
  }
}
