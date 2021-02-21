import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FiscalYear} from '../../../admin/modal/FiscalYear';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {FiscalYearService} from '../../../admin/service/fiscal-year.service';
import {ToastService} from '../../../../@core/utils';

@Component({
  selector: 'app-marketing-activities',
  templateUrl: './marketing-activities.component.html',
  styleUrls: ['./marketing-activities.component.scss']
})
export class MarketingActivitiesComponent implements OnInit {

  marketingActivityForm: FormGroup;
  spinner = false;
  fiscalYearArray = new Array<FiscalYear>();

  constructor(private formBuilder: FormBuilder,
              protected fiscalYearService: FiscalYearService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.getFiscalYears();
  }

  buildForm() {
    this.marketingActivityForm = this.formBuilder.group({});
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

}
