import {LoanStage} from '../../feature/loan/model/loanStage';
import {DocAction} from '../../feature/loan/model/docAction';

export class SignatureUtils {
  public static getSignatureList(stages: Array<LoanStage>): Array<LoanStage> {
    let lastBackwardIndex = 0;
    stages.forEach((data, index) => {
      if (data.docAction.toString() === DocAction.value(DocAction.BACKWARD)) {
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
}
