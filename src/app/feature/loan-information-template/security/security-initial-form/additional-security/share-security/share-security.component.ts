import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepseMaster} from '../../../../../admin/modal/NepseMaster';
import {environment} from '../../../../../../../environments/environment';
import {Clients} from '../../../../../../../environments/Clients';
import {Nepse} from '../../../../../admin/modal/nepse';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {ShareType} from '../../../../../loan/model/ShareType';
import {NepseService} from '../../../../../admin/component/nepse/nepse.service';
import {NepsePriceInfoService} from '../../../../../admin/component/nepse/nepse-price-info.service';
import {NepsePriceInfo} from '../../../../../admin/modal/NepsePriceInfo';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-share-security',
  templateUrl: './share-security.component.html',
  styleUrls: ['./share-security.component.scss']
})
export class ShareSecurityComponent implements OnInit {
  shareSecurityForm: FormGroup;
  activeNepseMaster: NepseMaster = new NepseMaster();
  nepseList: Array<Nepse> = new Array<Nepse>();
  nepsePriceInfo: NepsePriceInfo = new NepsePriceInfo();
  client = environment.client;
  clientName = Clients;
  search: any = {
    status: 'ACTIVE',
    shareType: undefined,
    companyName: undefined
  };

  constructor(private formBuilder: FormBuilder,
              private shareService: NepseService,
              private nepsePriceInfoService: NepsePriceInfoService,
              private datePipe: DatePipe, ) { }

  get shareField() {
    return this.shareSecurityForm.get('shareSecurity') as FormArray;
  }

  get totalConsideredValue() {
    let total = 0;
    this.shareField.controls.forEach(c => total += Number(c.get('consideredValue').value));
    return total.toFixed(2);
  }

  ngOnInit() {
    this.buildForm();
    this.getActiveNepsePriceInfo();
    this.findActiveShareRate();
    this.getAllNepseCompanyList(this.search);
  }

  private buildForm(): FormGroup {
    return this.shareSecurityForm = this.formBuilder.group({
      sharePriceDate: [undefined],
      avgDaysForPrice: [undefined],
      securityOffered: [undefined],
      shareSecurity: this.formBuilder.array([this.shareSecurityFormGroup()]),
    });
  }

  private shareSecurityFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: undefined,
      version: undefined,
      companyName: [undefined],
      companyCode: [undefined],
      shareType: undefined,
      totalShareUnit: [undefined],
      amountPerUnit: [undefined],
      total: [undefined],
      consideredValue: [undefined],
      priceEarningRatio: [undefined],
      priceBookValue: [undefined],
      dividendYeild: [undefined],
      dividendPayoutRatio: [undefined],
    });
  }

  public removeShareList(index: number): void {
    this.shareField.removeAt(index);
  }


  public addShareSecurity(): void {
    this.shareField.push(this.shareSecurityFormGroup());
  }

  public setShareValueByCompany(index: number): void {
    const companyName = this.shareField.at(index).get('companyName').value;
    const totalShareUnit = this.shareField.at(index).get('totalShareUnit').value;
    const matchedNepse = this.nepseList.filter(n => n.companyName === companyName);
    if (matchedNepse) {
      this.shareField.at(index).patchValue({
        shareType: matchedNepse[0].shareType,
        companyCode: matchedNepse[0].companyCode,
        amountPerUnit: matchedNepse[0].amountPerUnit,
        total: this.calculateTotalShareAmount(companyName, totalShareUnit),
        consideredValue: this.calculateConsideredAmount(
            this.shareField.at(index).get('totalShareUnit').value,
            this.shareField.at(index).get('amountPerUnit').value,
            matchedNepse[0].shareType
        )
      });
    }
  }

  private findActiveShareRate(): void {
    this.shareService.getActiveShare().subscribe(value => {
      if (!ObjectUtil.isEmpty(value.detail)) {
        this.activeNepseMaster = value.detail;
      }
    });
  }

  public calculateShareFieldsValues(index: number): void {
    const totalShareUnit = this.shareField.at(index).get('totalShareUnit').value;
    const amountPerUnit = this.shareField.at(index).get('amountPerUnit').value;
    const shareType = this.shareField.at(index).get('shareType').value;
    this.shareField.at(index).patchValue({
      total: totalShareUnit * amountPerUnit,
      consideredValue: this.calculateConsideredAmount(totalShareUnit, amountPerUnit, shareType)
    });
  }

  private calculateTotalShareAmount(companyName: string, totalShareUnit: number): number {
    if (ObjectUtil.isEmpty(companyName)) {
      return undefined;
    }
    const matchedNepse = this.nepseList.filter(n => n.companyName === companyName);
    return totalShareUnit ? totalShareUnit * Number(matchedNepse[0].amountPerUnit) : 0;
  }

  private calculateConsideredAmount(totalShareUnit: number, amountPerUnit: number, shareType): number {
    if (ObjectUtil.isEmpty(shareType)) {
      return undefined;
    }
    const activeNepse = shareType === ShareType.PROMOTER ? this.activeNepseMaster.promoter :
        this.activeNepseMaster.ordinary;
    return ((totalShareUnit * amountPerUnit) / 100) * activeNepse;
  }

  private getAllNepseCompanyList(search: any): void {
    this.shareService.findAllNepseCompanyData(search).subscribe((response) => {
      this.nepseList = response.detail;
    });
  }

  private getActiveNepsePriceInfo(): void {
    this.nepsePriceInfoService.getActiveNepsePriceInfoData().subscribe((response) => {
      this.nepsePriceInfo = response.detail;
      this.shareSecurityForm.get('sharePriceDate').patchValue(this.nepsePriceInfo && this.nepsePriceInfo.sharePriceDate ?
          this.datePipe.transform(this.nepsePriceInfo.sharePriceDate, 'yyyy-MM-dd') : undefined);
      this.shareSecurityForm.get('avgDaysForPrice').patchValue(this.nepsePriceInfo && this.nepsePriceInfo.avgDaysForPrice
          ? this.nepsePriceInfo.avgDaysForPrice : undefined);
    }, error => {
      console.error(error);
    });
  }
}
