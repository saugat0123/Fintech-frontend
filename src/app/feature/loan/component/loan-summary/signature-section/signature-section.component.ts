import {Component, Input, OnInit} from '@angular/core';
import {LoanStage} from '../../../model/loanStage';
import {DocAction} from '../../../model/docAction';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../model/loanData';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';

@Component({
  selector: 'app-signature-section',
  templateUrl: './signature-section.component.html',
  styleUrls: ['./signature-section.component.scss']
})
export class SignatureSectionComponent implements OnInit {
  // @Input() previousList;
  // @Input() currentStage;
  @Input() testInput: string;
  @Input() loanDataHolder: LoanDataHolder;
  RootUrl = ApiConfig.URL;

  signatureList: Array<LoanStage> = new Array<LoanStage>();

  constructor() { }

  ngOnInit() {
    this.signatureList = this.getSignatureList(new Array<LoanStage>
    (...this.loanDataHolder.previousList, this.loanDataHolder.currentStage));
  }

  /**
   * Get array of loan stage for authority signature array.
   *
   * @param stages Array of loan stages that must include previous stages and current stage.
   */
  private getSignatureList(stages: Array<LoanStage>): Array<LoanStage> {
    let lastBackwardIndex = 0;
    stages.forEach((data, index) => {
      if (data.docAction.toString() === DocAction.value(DocAction.BACKWARD)
          || data.docAction.toString() === DocAction.value(DocAction.RE_INITIATE)) {
        lastBackwardIndex = index;
      }
    });
    if (lastBackwardIndex !== 0) {
      stages.splice(0, lastBackwardIndex + 1);
    }
    const signatureList = new Array<LoanStage>();
    const addedStages = new Map<number, number>(); // KEY = loan stage from user id, value = array index
    stages.forEach((loanStage, index) => {
      if (loanStage.docAction.toString() !== DocAction.value(DocAction.TRANSFER)) {
        if (addedStages.has(loanStage.fromUser.id)) {
          signatureList[addedStages.get(loanStage.fromUser.id)] = loanStage;
        } else {
          signatureList.push(loanStage);
          addedStages.set(loanStage.fromUser.id, index);
        }
      }
    });

    return signatureList;
  }

  loanHandler(index: number, length: number, label: string) {
    if (index === length - 1 && index !== 0) {
      if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
        return 'APPROVED BY:';
      } else if (this.loanDataHolder.documentStatus.toString() === 'REJECTED') {
        return 'REJECTED BY:';
      } else if (this.loanDataHolder.documentStatus.toString() === 'CLOSED') {
        return 'CLOSED BY:';
      }
    }
    if (!ObjectUtil.isEmpty(label)) {
      return label;
    } else {
      if (index === 0) {
        if (this.signatureList[index].docAction.toString() === 'RE_INITIATE') {
          return 'RE INITIATED:';
        } else {
          return 'INITIATED BY:';
        }
      } else {
        return 'SUPPORTED BY:';
      }
    }
  }

}
