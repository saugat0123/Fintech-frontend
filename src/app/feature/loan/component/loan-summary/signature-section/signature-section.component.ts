import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanStage} from '../../../model/loanStage';
import {DocAction} from '../../../model/docAction';
import {LoanDataHolder} from '../../../model/loanData';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';

@Component({
  selector: 'app-signature-section',
  templateUrl: './signature-section.component.html',
  styleUrls: ['./signature-section.component.scss']
})
export class SignatureSectionComponent implements OnInit {
  @Input() signApprovalOn: boolean; // to know if the parent component requires comment
  // approval feature and filter signature approval sheet
  @Input() loanDataHolder: LoanDataHolder;
  @Output() commentApproval = new EventEmitter<boolean>();
  breakException: any;
  RootUrl = ApiConfig.URL;
  signatureList: Array<LoanStage> = new Array<LoanStage>();
  lastIndex: number;
  constructor() {
  }

  ngOnInit() {
    console.log('Loan Data holder ho hai', this.loanDataHolder);
    console.log('Index For Signature', this.signApprovalOn);
    this.signatureList = this.getSignatureList(new Array<LoanStage>
    (...this.loanDataHolder.previousList, this.loanDataHolder.currentStage));
    this.lastIndex = this.signatureList.length;
    console.log(' Signature', this.signatureList);
    console.log(' Signature', this.signatureList[this.lastIndex - 1]);
    if (this.signApprovalOn === true) {
      this.signatureList.forEach((v, i) => {
        if ((v.toRole.signApprovalSheet === true && v.docAction.toString() !== 'APPROVED') ||
            (this.loanDataHolder.currentStage.toRole.signApprovalSheet === true &&
                this.loanDataHolder.currentStage.docAction.toString() === 'TRANSFER')
        ) {
          if (this.signatureList[this.signatureList.length - 1].docAction.toString() !== 'APPROVED') {
            this.commentApproval.emit(true);

          }
        }


      });
      let lastIndex;
      let riskOfficerIndex;
      lastIndex = this.signatureList.length;
      try {
        this.signatureList.forEach((v, i) => {
          console.log(v, v.fromRole.signApprovalSheet, v.toRole.signApprovalSheet);
          if (v.fromRole.signApprovalSheet === true ||
              (this.loanDataHolder.currentStage.toRole.signApprovalSheet === true &&
                  this.loanDataHolder.currentStage.docAction.toString() === 'TRANSFER')) {
            riskOfficerIndex = i;
            console.log('Index', v, i);
            throw this.breakException;
          }
        });
      } catch (ex) {
        if (ex !== this.breakException) {
          throw ex;
        }
      }
      if (riskOfficerIndex > 0) {
        this.signatureList = this.signatureList.slice(riskOfficerIndex, lastIndex);
      } else {
        this.signatureList = [];
      }
    }
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
