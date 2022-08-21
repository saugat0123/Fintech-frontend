import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {RelationshipWithBank} from '../../../../admin/modal/relationship-with-bank';
import {BankingRelationship} from '../../../../admin/modal/banking-relationship';
import {AccountTurnover} from '../../../../admin/modal/account-turnover';
import {RepaymentHistory} from '../../../../admin/modal/repayment-history';
import {Pattern} from '../../../../../@core/utils/constants/pattern';
import {environment} from '../../../../../../environments/environment';
import {RepaymentTrackCurrentBank} from '../../../../admin/modal/crg/RepaymentTrackCurrentBank';

@Component({
  selector: 'app-banking-relation',
  templateUrl: './banking-relation.component.html',
  styleUrls: ['./banking-relation.component.scss']
})
export class BankingRelationComponent implements OnInit {
  @Input() formValue;

  bankingRelationForm: FormGroup;
  bankingRelation: RelationshipWithBank;
  bankingRelationshipList = BankingRelationship.enumObject();
  accountTurnoverList = AccountTurnover.enumObject();
  repaymentHistoryList = RepaymentHistory.enumObject();
  submitted = false;
  isNewCustomer = false;
  disabledLambda = environment.disableCrgLambda;
  disabledAlpha = environment.disableCrgAlpha;
  repaymentTrack = RepaymentTrackCurrentBank.enumObject();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.formValue)) {
      this.bankingRelation = JSON.parse(this.formValue);
      this.bankingRelationForm.patchValue(this.bankingRelation);
      if (!ObjectUtil.isEmpty(this.bankingRelation.accountTransactionForm)) {
        this.bankingRelationForm.get('accountTransactionForm').patchValue(JSON.parse(this.bankingRelation.accountTransactionForm));
      }
    }
  }

  buildForm() {
    this.bankingRelationForm = this.formBuilder.group({
      bankingRelationship: [ObjectUtil.isEmpty(this.bankingRelation) ? undefined :
          this.bankingRelation.bankingRelationship],
      accountTurnover: [ObjectUtil.isEmpty(this.bankingRelation) ? undefined :
          this.bankingRelation.accountTurnover, Validators.required],
      repaymentHistory: [ObjectUtil.isEmpty(this.bankingRelation) ? undefined :
          this.bankingRelation.repaymentHistory, Validators.required],
      accountTransactionForm: this.buildAccountTransactionForm(),
      repaymentRemarks: [ObjectUtil.isEmpty(this.bankingRelation) ? undefined :
          this.bankingRelation.repaymentRemarks],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.bankingRelation = new RelationshipWithBank();
    this.bankingRelation.bankingRelationship = this.bankingRelationForm.get('bankingRelationship').value;
    this.bankingRelation.accountTurnover = this.bankingRelationForm.get('accountTurnover').value;
    this.bankingRelation.repaymentHistory = this.bankingRelationForm.get('repaymentHistory').value;
    this.bankingRelation.repaymentRemarks = this.bankingRelationForm.get('repaymentRemarks').value;
    this.bankingRelation.accountTransactionForm = JSON.stringify(this.bankingRelationForm.get('accountTransactionForm').value);
  }

  get formControl() {
    return this.bankingRelationForm.controls;
  }
  get transactionForm() {
    return this.bankingRelationForm.controls.accountTransactionForm['controls'];
  }
  onAdditionalFieldSelect(chk) {
    if (chk) {
      this.bankingRelationForm.get('accountTransactionForm').disable();
    } else {
      this.bankingRelationForm.get('accountTransactionForm').enable();
    }
    this.isNewCustomer = chk;
  }
  buildAccountTransactionForm() {
    return this.formBuilder.group({
      creditTransactionNumber: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      creditTransactionValue: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      debitTransactionNumber: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      debitTransactionValue: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      repaymentTrackWithCurrentBank: [undefined],
      remarks: [undefined],
      creditEntries: [undefined],
      creditEntriesValue: [undefined],

    });
  }

}
