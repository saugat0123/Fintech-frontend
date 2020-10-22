import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {RelationshipWithBank} from '../../../../admin/modal/relationship-with-bank';
import {BankingRelationship} from '../../../../admin/modal/banking-relationship';
import {AccountTurnover} from '../../../../admin/modal/account-turnover';
import {RepaymentHistory} from '../../../../admin/modal/repayment-history';

@Component({
  selector: 'app-banking-relation',
  templateUrl: './banking-relation.component.html',
  styleUrls: ['./banking-relation.component.scss']
})
export class BankingRelationComponent implements OnInit, OnChanges {
  @Input() formValue;

  bankingRelationForm: FormGroup;
  bankingRelation: RelationshipWithBank;
  bankingRelationshipList = BankingRelationship.enumObject();
  accountTurnoverList = AccountTurnover.enumObject();
  repaymentHistoryList = RepaymentHistory.enumObject();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formValue)) {
      this.bankingRelation = JSON.parse(this.formValue);
    }
    this.buildForm();
  }

  buildForm() {
    this.bankingRelationForm = this.formBuilder.group({
      bankingRelationship: [ObjectUtil.isEmpty(this.bankingRelation) ? undefined :
          this.bankingRelation.bankingRelationship, Validators.required],
      accountTurnover: [ObjectUtil.isEmpty(this.bankingRelation) ? undefined :
          this.bankingRelation.accountTurnover, Validators.required],
      repaymentHistory: [ObjectUtil.isEmpty(this.bankingRelation) ? undefined :
          this.bankingRelation.repaymentHistory, Validators.required],
    });
  }

  onSubmit() {
    this.bankingRelation = new RelationshipWithBank();
    this.bankingRelation.bankingRelationship = this.bankingRelationForm.get('bankingRelationship').value;
    this.bankingRelation.accountTurnover = this.bankingRelationForm.get('accountTurnover').value;
    this.bankingRelation.repaymentHistory = this.bankingRelationForm.get('repaymentHistory').value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!ObjectUtil.isEmpty(changes.formValue.currentValue)) {
      this.bankingRelationForm.patchValue(changes.formValue.currentValue);
    }
  }

}
