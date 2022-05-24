import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Form, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';


@Component({
  selector: 'app-net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.scss']
})
export class NetWorthComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  constructor(private formBuilder: FormBuilder,
              private activeModal: NgbActiveModal,
              private overlay: NgxSpinnerService) { }
  totalNetWorth=0;
  @Output() dataEmiter: EventEmitter<any> = new EventEmitter<any>();
  @Input() data: any;
  @Input() customerName: any;
  ngOnInit() {
    this.buildForm();
    if(!ObjectUtil.isEmpty(this.data)){
      this.form.patchValue(JSON.parse(this.data));
    }
  }

  buildForm()
  {
    this.form = this.formBuilder.group({
      cashDepositInOtherBank: undefined,
      realEstateProperties: undefined,
      investmentInShares: undefined,
      vehicle: undefined,
      jewelleries: undefined,
      totalAssets: undefined,
      loanFromCCBL: undefined,
      creditCardsLimit : undefined,
      otherLiabilities: undefined,
      totalLiabilities: undefined,
      totalNetWorth: undefined

    })
  }

  submit(){
      this.dataEmiter.emit(this.form.value);
      this.activeModal.close();
  }

  calculateTotalAssets(){
    const total = Number(this.form.get('cashDepositInOtherBank').value) +
        Number(this.form.get('realEstateProperties').value)
        + Number(this.form.get('investmentInShares').value) +
        Number(this.form.get('vehicle').value) + Number(this.form.get('jewelleries').value);
    this.form.get('totalAssets').patchValue(total);
    this.calculateNetWorth();
  }

  calculateTotalLiabilities(){
    const total = Number(this.form.get('loanFromCCBL').value) +
        Number(this.form.get('creditCardsLimit').value)
        + Number(this.form.get('otherLiabilities').value);
    this.form.get('totalLiabilities').patchValue(total);
    this.calculateNetWorth();
  }

  calculateNetWorth(){
    if(!ObjectUtil.isEmpty(this.form.get('totalLiabilities'))) {
      const totalNetWorth = (Number(this.form.get('totalAssets').value) - Number(this.form.get('totalLiabilities').value));
      this.form.get('totalNetWorth').patchValue(totalNetWorth);
    }
  }

}
