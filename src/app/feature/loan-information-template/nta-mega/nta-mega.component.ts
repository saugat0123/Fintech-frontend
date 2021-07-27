import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NetTradingAssets} from '../../admin/modal/NetTradingAssets';
import {CalendarType} from '../../../@core/model/calendar-type';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {FiscalYear} from '../../admin/modal/FiscalYear';
import {FiscalYearService} from '../../admin/service/fiscal-year.service';
import {ToastService} from '../../../@core/utils';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {Editor} from '../../../@core/utils/constants/editor';

@Component({
  selector: 'app-nta-mega',
  templateUrl: './nta-mega.component.html',
  styleUrls: ['./nta-mega.component.scss']
})
export class NtaMegaComponent implements OnInit {
  @Input() netTradingAssetsData?: NetTradingAssets;
  @Input() fromProfile: boolean;
  @Output() netTradingAssetsEventEmitter = new EventEmitter();

  currentYearIndex = 0;
  selectedIndex = 0;

  calendarType = CalendarType.AD;

  quarterCalculationObject = {
    q1: undefined,
    q2: undefined,
    q3: undefined,
    q4: undefined,
    average: undefined
  };

  netTradingAssetSubmitData: NetTradingAssets = new NetTradingAssets();
  parentForm: FormGroup;
  netTradingAssetsFormArray: FormArray;
  fiscalYearArray = new Array<FiscalYear>();

  // Client
  client = environment.client;
  clientName = Clients;
  ckeConfig = Editor.CK_CONFIG;
  spinner = false;

  constructor(protected formBuilder: FormBuilder,
              protected fiscalYearService: FiscalYearService,
              protected toastService: ToastService) {
  }

  ngOnInit() {
    this.parentForm = this.formBuilder.group({
      netTradingAssetsFormArray: this.formBuilder.array([])
    });
    this.netTradingAssetsFormArray = this.parentForm.get('netTradingAssetsFormArray') as FormArray;
    this.getFiscalYears();
  }

  verifyDataWithFiscalYear(fiscalYearArray: Array<FiscalYear>) {
    if (!ObjectUtil.isEmpty(this.netTradingAssetsData)) {

      const parsedNtaData = JSON.parse(this.netTradingAssetsData.data) as Array<any>;

      const fiscalYearComparisonArray = this.mapObjectToIdArray(fiscalYearArray);
      const parsedNtaDataComparisonArray = this.mapObjectToIdArray(parsedNtaData);

      // check if new year has been added
      const newFiscalArray = fiscalYearComparisonArray.filter(f => {
        return !parsedNtaDataComparisonArray.includes(f);
      });

      // check if a year has been disabled TODO: test-scenario
      const disabledFiscalArray = parsedNtaDataComparisonArray.filter(p => {
        return !fiscalYearComparisonArray.includes(p);
      });

      // add new array --
      if (newFiscalArray.length > 0) {
        newFiscalArray.forEach(v => {
          parsedNtaData.push({
            id: v,
            isCurrentYear: false,
            valueOfStock: this.formBuilder.group(this.quarterCalculationObject),
            valueOfReceivables: this.formBuilder.group(this.quarterCalculationObject),
            advancesAndDeposits: this.formBuilder.group(this.quarterCalculationObject),
            otherCurrentAssets: this.formBuilder.group(this.quarterCalculationObject),
            valueOfCreditors: this.formBuilder.group(this.quarterCalculationObject),
            otherCurrentLiability: this.formBuilder.group(this.quarterCalculationObject),
            netTradingAssets: this.formBuilder.group(this.quarterCalculationObject),
            deRatio: this.formBuilder.group(this.quarterCalculationObject),
            wcLoanOrLimit: this.formBuilder.group(this.quarterCalculationObject),
            ytdSales: this.formBuilder.group(this.quarterCalculationObject),
            asOnDate: this.formBuilder.group(this.quarterCalculationObject)
          });
        });
      }

      // remove disabled -- TODO: test-scenario
      if (disabledFiscalArray.length > 0) {
        parsedNtaData.forEach((o, i) => {
          disabledFiscalArray.forEach((vId, j) => {
            if (Number(o.id) === Number(vId)) {
              parsedNtaData.splice(i, 1);
            }
          });
        });
      }

      // Check current Year --
      parsedNtaData.forEach(pObj => {
        pObj.isCurrentYear = false;
      });
      this.fiscalYearArray.forEach(obj => {
        if (obj.isCurrentYear) {
          parsedNtaData.some(po => {
            if (Number(po.id) === Number(obj.id)) {
              po.isCurrentYear = true;
              this.currentYearIndex = parsedNtaData.indexOf(po);
              return true;
            } else {
              return false;
            }
          });
        }
      });

      parsedNtaData.forEach((v, i) => {
        const formObjectData = {
          id: v.id,
          isCurrentYear: v.isCurrentYear,
          valueOfStock: this.formBuilder.group(this.setNestedFormValues(v.valueOfStock)),
          valueOfReceivables: this.formBuilder.group(this.setNestedFormValues(v.valueOfReceivables)),
          advancesAndDeposits: this.formBuilder.group(this.setNestedFormValues(v.advancesAndDeposits)),
          otherCurrentAssets: this.formBuilder.group(this.setNestedFormValues(v.otherCurrentAssets)),
          valueOfCreditors: this.formBuilder.group(this.setNestedFormValues(v.valueOfCreditors)),
          otherCurrentLiability: this.formBuilder.group(this.setNestedFormValues(v.otherCurrentLiability)),
          asOnDate: this.formBuilder.group(this.setNestedDateValues(v.asOnDate)),
          netTradingAssets: this.formBuilder.group(this.setNestedFormValues(v.netTradingAssets)),
          deRatio: this.formBuilder.group(this.setNestedFormValues(v.deRatio)),
          ytdSales: this.formBuilder.group(this.setNestedFormValues(v.ytdSales)),
          wcLoanOrLimit: this.formBuilder.group(this.setNestedFormValues(v.wcLoanOrLimit)),
          ntaRemarks: v.ntaRemarks,
        };
        this.netTradingAssetsFormArray.push(
            this.formBuilder.group(formObjectData)
        );
        if (v.isCurrentYear) {
          this.currentYearIndex = parsedNtaData.indexOf(v);
          this.selectedIndex = this.currentYearIndex;
        }
      });

    } else {
      this.fiscalYearArray.forEach(fiscalYearObj => {
        const formObjectData = {
          id: fiscalYearObj.id,
          ntaRemarks: fiscalYearObj.ntaRemarks,
          isCurrentYear: fiscalYearObj.isCurrentYear,
          valueOfStock: this.formBuilder.group(this.quarterCalculationObject),
          valueOfReceivables: this.formBuilder.group(this.quarterCalculationObject),
          advancesAndDeposits: this.formBuilder.group(this.quarterCalculationObject),
          otherCurrentAssets: this.formBuilder.group(this.quarterCalculationObject),
          valueOfCreditors: this.formBuilder.group(this.quarterCalculationObject),
          otherCurrentLiability: this.formBuilder.group(this.quarterCalculationObject),
          asOnDate: this.formBuilder.group(this.quarterCalculationObject),
          netTradingAssets: this.formBuilder.group(this.quarterCalculationObject),
          deRatio: this.formBuilder.group(this.quarterCalculationObject),
          ytdSales: this.formBuilder.group(this.quarterCalculationObject),
          wcLoanOrLimit: this.formBuilder.group(this.quarterCalculationObject)
        };
        this.netTradingAssetsFormArray.push(this.formBuilder.group(formObjectData));
        if (fiscalYearObj.isCurrentYear) {
          this.currentYearIndex = this.fiscalYearArray.indexOf(fiscalYearObj);
          this.selectedIndex = this.currentYearIndex;
        }
      });
    }
  }

  getFiscalYears() {
    this.spinner = true;
    this.fiscalYearService.getAll().subscribe(response => {
      this.fiscalYearArray = response.detail;
      this.verifyDataWithFiscalYear(this.fiscalYearArray);
      this.spinner = false;
    }, error => {
      console.log(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!'));
    });
  }

  setNestedFormValues(param) {
    if (param) {
      return {
        q1: param.q1,
        q2: param.q2,
        q3: param.q3,
        q4: param.q4,
        average: param.average
      };
    } else {
      return this.quarterCalculationObject;
    }
  }

  setNestedDateValues(param) {
    return {
      q1: ObjectUtil.isEmpty(param.q1) ? param.q1 : new Date(param.q1),
      q2: ObjectUtil.isEmpty(param.q2) ? param.q2 : new Date(param.q2),
      q3: ObjectUtil.isEmpty(param.q3) ? param.q3 : new Date(param.q3),
      q4: ObjectUtil.isEmpty(param.q4) ? param.q4 : new Date(param.q4),
      average: ObjectUtil.isEmpty(param.average) ? param.average : new Date(param.average)
    };
  }

  mapObjectToIdArray(objectArray: Array<any>): Array<any> {
    return objectArray.map(o => {
      return o.id;
    });
  }

  calculateNta(ntaFormGroup, header, q) {
    this.calculateNtaAfter(ntaFormGroup, q);
    this.calculateAverage(ntaFormGroup, header);
    this.calculateAverage(ntaFormGroup, 'netTradingAssets');
    this.calculateAverage(ntaFormGroup, 'deRatio');
  }

  calculateAverage(ntaFormGroup, header) {
    let elementsArray = [
      ntaFormGroup.get([header, 'q1']).value,
      ntaFormGroup.get([header, 'q2']).value,
      ntaFormGroup.get([header, 'q3']).value,
      ntaFormGroup.get([header, 'q4']).value,
    ];
    elementsArray = elementsArray.filter(e => {
      return !ObjectUtil.isEmpty(e);
    });
    ntaFormGroup.get([header, 'average'])
        .patchValue((Number(elementsArray.reduce((x, y) => x + y, 0) / elementsArray.length).toFixed(2))
        );
  }

  calculateNtaAfter(ntaFormGroup, quarter) {
    ntaFormGroup.get(['netTradingAssets', quarter]).patchValue(
        Number(ntaFormGroup.get(['valueOfStock', quarter]).value) +
        Number(ntaFormGroup.get(['valueOfReceivables', quarter]).value) +
        Number(ntaFormGroup.get(['advancesAndDeposits', quarter]).value) +
        Number(ntaFormGroup.get(['otherCurrentAssets', quarter]).value) -
        Number(ntaFormGroup.get(['valueOfCreditors', quarter]).value) -
        Number(ntaFormGroup.get(['otherCurrentLiability', quarter]).value)
    );
    ntaFormGroup.get(['deRatio', quarter]).patchValue(
        (Number(ntaFormGroup.get(['wcLoanOrLimit', quarter]).value) /
        Number(ntaFormGroup.get(['netTradingAssets', quarter]).value)) * 100);
  }

  onChangeFiscalYear(selectedFiscalYearObj) {
    this.spinner = true;
    this.netTradingAssetsFormArray.controls.forEach(singleControl => {
      if (Number(selectedFiscalYearObj.id) === Number(singleControl.value.id)) {
        this.selectedIndex = this.netTradingAssetsFormArray.controls.indexOf(singleControl);
      }
    });
    this.spinner = false;
  }

  onSubmit() {
    if (!ObjectUtil.isEmpty(this.netTradingAssetsData)) {
      this.netTradingAssetSubmitData = this.netTradingAssetsData;
    }
    this.netTradingAssetSubmitData.data = JSON.stringify(this.netTradingAssetsFormArray.value);
    this.netTradingAssetsEventEmitter.emit(this.netTradingAssetSubmitData);
  }
}
