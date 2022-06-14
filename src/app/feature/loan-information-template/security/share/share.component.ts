import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NepseMaster} from '../../../admin/modal/NepseMaster';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {ShareType} from '../../../loan/model/ShareType';
import {Nepse} from '../../../admin/modal/nepse';
import {NepseService} from '../../../admin/component/nepse/nepse.service';
import {Security} from '../../../loan/model/security';
import {NepsePriceInfoService} from '../../../admin/component/nepse/nepse-price-info.service';
import {NepsePriceInfo} from '../../../admin/modal/NepsePriceInfo';
import {NbToastrService} from '@nebular/theme';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {DatePipe} from '@angular/common';
import {CalendarType} from '../../../../@core/model/calendar-type';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {
  shareSecurityForm: FormGroup;
  activeNepseMaster: NepseMaster = new NepseMaster();
  nepsePriceInfo: NepsePriceInfo = new NepsePriceInfo();
  nepseList: Array<Nepse> = new Array<Nepse>();
  search: any = {
    status: 'ACTIVE',
    shareType: undefined,
    companyName: undefined
  };
  submitted = false;
  @Input() security: Security;
  @Input() isEdit = false;
  @Input() calendarType: CalendarType;


  constructor(private formBuilder: FormBuilder,
              private shareService: NepseService,
              private nepsePriceInfoService: NepsePriceInfoService,
              private toastService: NbToastrService,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.buildForm();
    this.getNepseList();
    this.getLastNepsePriceInfo();
    this.getActiveShare();
    if (!ObjectUtil.isEmpty(this.security)) {
      this.setShareSecurityData();
    } else {
      this.addShareSecurity();
    }
  }

  get shareField() {
    return this.shareSecurityForm.get('shareSecurityDetails') as FormArray;
  }

  get totalConsideredValue() {
    let total = 0;
    this.shareField.controls.forEach(c => total += Number(c.get('considerValue').value));
    return total.toFixed(2);
  }


  private getLastNepsePriceInfo(): void {
    this.nepsePriceInfoService.getActiveNepsePriceInfoData().subscribe((response: any) => {
      this.nepsePriceInfo = response.detail;
      this.shareSecurityForm.get('sharePriceDate').patchValue(this.datePipe.transform(this.nepsePriceInfo.sharePriceDate, 'yyyy-MM-dd'));
      this.shareSecurityForm.get('avgDaysForPrice').patchValue(this.nepsePriceInfo.avgDaysForPrice);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Unable to load data!!!'));
    });
  }

  private getActiveShare(): void {
    this.shareService.getActiveShare().subscribe((response: any) => {
      this.activeNepseMaster = response.detail;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Unable to load data!!!'));
    });
  }

  private getNepseList(): void {
    this.shareService.findAllNepseCompanyData(this.search).subscribe((list) => {
      this.nepseList = list.detail;
    });
  }

  private buildForm(): FormGroup {
    return this.shareSecurityForm = this.formBuilder.group({
      shareSecurityDetails: this.formBuilder.array([]),
      securityOffered: [undefined],
      loanShareRate: [undefined],
      sharePriceDate: [undefined],
      avgDaysForPrice: [undefined],
    });
  }

  private setShareSecurityData(): void {
    const formControl = this.shareSecurityForm.get('shareSecurityDetails') as FormArray;
    const data = JSON.parse(this.security.data);
    formControl.push(
        this.formBuilder.group({
          companyName: [data.companyName],
          companyCode: [data.companyCode],
          shareType: [data.shareType],
          totalShareUnit: [data.totalShareUnit],
          amountPerUnit: [data.amountPerUnit],
          total: [data.total],
          considerValue: [data.considerValue],
          priceEarningRatio: [data.priceEarningRatio],
          priceBookValue: [data.priceBookValue],
          dividendYeild: [data.dividendYeild],
          dividendPayoutRatio: [data.dividendPayoutRatio],
          ratioAsPerAuitedFinancial: [data.ratioAsPerAuitedFinancial],
          shareRate: [data.shareRate],
          drawingPower: [data.drawingPower],
          shareSecurityFirstValuationDate: [new Date(data.shareSecurityFirstValuationDate)]
        })
    );
  }

  private calculateConsideredAmount(totalShareUnit: number, amountPerUnit: number, shareType) {
    if (ObjectUtil.isEmpty(shareType)) {
      return undefined;
    }
    const activeNepse = shareType === ShareType.PROMOTER ? this.activeNepseMaster.promoter :
        this.activeNepseMaster.ordinary;
    return ((totalShareUnit * amountPerUnit) / 100) * activeNepse;
  }

  calculateShareFieldsValues(index: number) {
    const totalShareUnit = this.shareField.at(index).get('totalShareUnit').value;
    const amountPerUnit = this.shareField.at(index).get('amountPerUnit').value;
    const shareType = this.shareField.at(index).get('shareType').value;
    this.shareField.at(index).patchValue({
      total: totalShareUnit * amountPerUnit,
      drawingPower: this.calculateConsideredAmount(totalShareUnit, amountPerUnit, shareType)
    });
    this.calcRealiasable(index, 'share');
  }

  public calcRealiasable(i, key): void {
    if (key === 'share') {
      const reliasableValue = (Number(this.shareSecurityForm.get(['shareSecurityDetails', i, 'total']).value)
          * (Number(this.shareSecurityForm.get(['shareSecurityDetails', i, 'shareRate']).value) / 100));
      this.shareSecurityForm.get(['shareSecurityDetails', i, 'considerValue']).patchValue(reliasableValue);
    }
  }

  setShareValueByCompany(index: number) {
    const companyName = this.shareField.at(index).get('companyName').value;
    const totalShareUnit = this.shareField.at(index).get('totalShareUnit').value;
    const matchedNepse = this.nepseList.filter(n => n.companyName === companyName);
    if (matchedNepse) {
      this.shareField.at(index).patchValue({
        shareType: matchedNepse[0].shareType,
        companyCode: matchedNepse[0].companyCode,
        amountPerUnit: matchedNepse[0].amountPerUnit,
        total: this.calculateTotalShareAmount(companyName, totalShareUnit),
        considerValue: this.calculateConsideredAmount(
            this.shareField.at(index).get('totalShareUnit').value,
            this.shareField.at(index).get('amountPerUnit').value,
            matchedNepse[0].shareType
        )
      });
    }
  }

  private calculateTotalShareAmount(companyName: string, totalShareUnit: number): number {
    if (ObjectUtil.isEmpty(companyName)) {
      return undefined;
    }
    const matchedNepse = this.nepseList.filter(n => n.companyName === companyName);
    return totalShareUnit ? totalShareUnit * Number(matchedNepse[0].amountPerUnit) : 0;
  }

  public shareSecurityFormGroup(): FormGroup {
    return this.formBuilder.group({
      companyName: [undefined, Validators.required],
      companyCode: [undefined],
      shareType: undefined,
      totalShareUnit: [undefined, Validators.required],
      amountPerUnit: [undefined],
      total: [undefined],
      considerValue: [undefined],
      priceEarningRatio: [undefined],
      priceBookValue: [undefined],
      dividendYeild: [undefined],
      dividendPayoutRatio: [undefined],
      ratioAsPerAuitedFinancial: [undefined],
      shareRate: [undefined],
      drawingPower: [undefined],
      shareSecurityFirstValuationDate: [undefined]
    });
  }

  public addShareSecurity(): void {
    this.shareField.push(this.shareSecurityFormGroup());
  }

  public removeShareList(index: number): void {
    this.shareField.removeAt(index);
  }

}
