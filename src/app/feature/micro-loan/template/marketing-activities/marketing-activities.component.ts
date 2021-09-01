import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FiscalYear} from '../../../admin/modal/FiscalYear';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {FiscalYearService} from '../../../admin/service/fiscal-year.service';
import {ToastService} from '../../../../@core/utils';
import {MarketingActivities} from '../../../loan/model/marketing-activities';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-marketing-activities',
  templateUrl: './marketing-activities.component.html',
  styleUrls: ['./marketing-activities.component.scss']
})
export class MarketingActivitiesComponent implements OnInit {
  @Input() fromProfile;
  @Input() marketingActivitiesData;
  @Output() dataEmitter = new EventEmitter();
  marketingActivityForm: FormGroup;
  spinner = false;
  fiscalYearArray = new Array<FiscalYear>();
  private submitted = false;

  marketingActivities: MarketingActivities = new MarketingActivities();
  private dataForEdit: any;

  constructor(private formBuilder: FormBuilder,
              protected fiscalYearService: FiscalYearService,
              private toastService: ToastService,
              private overlay: NgxSpinnerService) {
  }

  ngOnInit() {
    this.getFiscalYears();
    this.buildForm();

    if (!ObjectUtil.isEmpty(this.marketingActivitiesData)) {
      this.dataForEdit = JSON.parse(this.marketingActivitiesData.data);
      this.marketingActivityForm.patchValue(this.dataForEdit);
    }

  }

  buildForm() {
    this.marketingActivityForm = this.formBuilder.group({
      currentQuarterYear: [undefined, Validators.required],
      firstFiscalYear: [undefined, Validators.required],
      secondFiscalYear: [undefined, Validators.required],
      thirdFiscalYear: [undefined, Validators.required],

      currentQuarterYearDistrict: [undefined, Validators.required],
      firstFiscalYearDistrict: [undefined, Validators.required],
      secondFiscalYearDistrict: [undefined, Validators.required],
      thirdFiscalYearDistrict: [undefined, Validators.required],

      currentQuarterYearBranchNo: [undefined, Validators.required],
      firstFiscalYearBranchNo: [undefined, Validators.required],
      secondFiscalYearBranchNo: [undefined, Validators.required],
      thirdFiscalYearBranchNo: [undefined, Validators.required],

      currentQuarterYearMemberNo: [undefined, Validators.required],
      firstFiscalYearMemberNo: [undefined, Validators.required],
      secondFiscalYearMemberNo: [undefined, Validators.required],
      thirdFiscalYearMemberNo: [undefined, Validators.required],

      currentQuarterYearBorrowers: [undefined, Validators.required],
      firstFiscalYearBorrowers: [undefined, Validators.required],
      secondFiscalYearBorrowers: [undefined, Validators.required],
      thirdFiscalYearBorrowers: [undefined, Validators.required],

      currentQuarterYearDisbursed: [undefined, Validators.required],
      firstFiscalYearDisbursed: [undefined, Validators.required],
      secondFiscalYearDisbursed: [undefined, Validators.required],
      thirdFiscalYearDisbursed: [undefined, Validators.required],

      currentQuarterYearDeposit: [undefined, Validators.required],
      firstFiscalYearDeposit: [undefined, Validators.required],
      secondFiscalYearDeposit: [undefined, Validators.required],
      thirdFiscalYearDeposit: [undefined, Validators.required],

      currentQuarterYearProfit: [undefined, Validators.required],
      firstFiscalYearNetProfit: [undefined, Validators.required],
      secondFiscalYearNetProfit: [undefined, Validators.required],
      thirdFiscalYearNetProfit: [undefined, Validators.required],

      currentQuarterNPA: [undefined, Validators.required],
      firstFiscalYearNPA: [undefined, Validators.required],
      secondFiscalYearNPA: [undefined, Validators.required],
      thirdFiscalYearNPA: [undefined, Validators.required],

      currentQuarterTotalBorrow: [undefined, Validators.required],
      firstFiscalYearTotalBorrow: [undefined, Validators.required],
      secondFiscalYearTotalBorrow: [undefined, Validators.required],
      thirdFiscalYearTotalBorrow: [undefined, Validators.required],
    });
  }

  getFiscalYears() {
    this.spinner = true;
    this.fiscalYearService.getAll().subscribe(response => {
      this.fiscalYearArray = response.detail;
      /*this.verifyDataWithFiscalYear(this.fiscalYearArray);*/
      this.spinner = false;
    }, error => {
      console.log(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!'));
    });
  }

  onChangeFiscalYear(selectedFiscalYearObj) {
    this.spinner = true;
   /* this.netTradingAssetsFormArray.controls.forEach(singleControl => {
      if (Number(selectedFiscalYearObj.id) === Number(singleControl.value.id)) {
        this.selectedIndex = this.netTradingAssetsFormArray.controls.indexOf(singleControl);
      }
    });*/
    this.spinner = false;
  }

  submitForm() {
    this.overlay.show();
    this.submitted = true;
    if (this.marketingActivityForm.invalid) {
      this.toastService.show(new Alert(AlertType.ERROR, 'All fields are mandatory!'));
      return;
    }
    this.marketingActivities.data = JSON.stringify(this.marketingActivityForm.value);
    this.dataEmitter.emit(this.marketingActivities);
  }

}
