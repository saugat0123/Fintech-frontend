import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {SummaryType} from '../../loan/component/SummaryType';

@Component({
  selector: 'app-crg-gamma-detail-view',
  templateUrl: './crg-gamma-detail-view.component.html',
  styleUrls: ['./crg-gamma-detail-view.component.scss']
})
export class CrgGammaDetailViewComponent implements OnInit {

  @Input() formData;
  @Input() loanCategory;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  crgGammaList = [];
  crgGammaData;

  constructor() { }

  ngOnInit() {
    this.crgGammaData = JSON.parse(this.formData.data);

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
