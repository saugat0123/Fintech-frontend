import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NepseService} from '../../../../admin/component/nepse/nepse.service';
import {Nepse} from '../../../../admin/modal/nepse';
import {ShareSecurity} from '../../../../admin/modal/shareSecurity';
import {CustomerShareData} from '../../../../admin/modal/CustomerShareData';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {ShareType} from '../../../model/ShareType';

@Component({
  selector: 'app-share-security',
  templateUrl: './share-security.component.html',
  styleUrls: ['./share-security.component.scss']
})
export class ShareSecurityComponent implements OnInit {
  @Input() shareSecurity: ShareSecurity;
  form: FormGroup;
  shareType = ShareType;
  activeNepseMaster: NepseMaster = new NepseMaster();
  nepseList: Array<Nepse> = new Array<Nepse>();
  shareSecurityData: ShareSecurity = new ShareSecurity();
  search: any = {
    status: 'ACTIVE',
    shareType: undefined,
    companyName: undefined
  };
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private  shareService: NepseService
  ) {
  }

  get shareField() {
    return this.form.get('shareField') as FormArray;
  }

  get totalConsideredValue() {
    let total = 0;
    this.shareField.controls.forEach(c => total += Number(c.get('consideredValue').value));
    return total;
  }

  ngOnInit() {
    this.findActiveShareRate();
    this.buildForm();
    this.shareService.findAllNepseCompanyData(this.search).subscribe((list) => {
      this.nepseList = list.detail;
      // Important: Push the form only after nepse list is subscribed.
      if (ObjectUtil.isEmpty(this.shareSecurity)) {
        this.addShareList(new CustomerShareData());
      } else {
        this.shareSecurityData.id = this.shareSecurity.id;
        this.shareSecurityData.version = this.shareSecurity.version;
        this.shareSecurity.customerShareData.forEach(v => this.addShareList(v));
      }
    });
  }

  public onSubmit(): void {
    this.form.get('loanShareRate').setValue(this.activeNepseMaster);
    this.shareSecurityData.data = JSON.stringify(this.form.value);
    this.shareSecurityData.customerShareData = this.getShareDataList();
  }

  public addShareList(data: CustomerShareData | null): void {
    data = ObjectUtil.setInputOrElseNext(data, new CustomerShareData());
    this.shareField.push(
        this.formBuilder.group({
          id: [
            ObjectUtil.setUndefinedIfNull(data.id)
          ],
          version: [
            ObjectUtil.setUndefinedIfNull(data.version)
          ],
          companyCode: [
            ObjectUtil.setUndefinedIfNull(data.companyCode),
            Validators.required
          ],
          companyName: [
            ObjectUtil.setUndefinedIfNull(data.companyName),
            Validators.required
          ],
          shareType: [
            ObjectUtil.setUndefinedIfNull(data.shareType),
            Validators.required
          ],
          totalShareUnit: [
            ObjectUtil.setInputOrElseNext(data.totalShareUnit, 0),
            Validators.required
          ],
          amountPerUnit: [
            ObjectUtil.setInputOrElseNext(this.calculateAmountPerUnit(data.companyName), 0),
            Validators.required
          ],
          total: [
            ObjectUtil.setInputOrElseNext(this.calculateTotalShareAmount(data.companyName, data.totalShareUnit), 0),
            Validators.required
          ],
          consideredValue: [
            ObjectUtil.setInputOrElseNext(
                this.calculateConsideredAmount(data.totalShareUnit, data.amountPerUnit, data.shareType),
                0),
            Validators.required
          ],
        })
    );
  }

  public removeShareList(index: number): void {
    this.shareField.removeAt(index);
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

  calculateShareFieldsValues(index: number) {
    const totalShareUnit = this.shareField.at(index).get('totalShareUnit').value;
    const amountPerUnit = this.shareField.at(index).get('amountPerUnit').value;
    const shareType = this.shareField.at(index).get('shareType').value;
    this.shareField.at(index).patchValue({
      total: totalShareUnit * amountPerUnit,
      consideredValue: this.calculateConsideredAmount(totalShareUnit, amountPerUnit, shareType)
    });
  }

  private calculateAmountPerUnit(companyName: string): number {
    if (ObjectUtil.isEmpty(companyName)) {
      return undefined;
    }
    const matchedNepse = this.nepseList.filter(n => n.companyName === companyName);
    return Number(matchedNepse[0].amountPerUnit);
  }

  private calculateTotalShareAmount(companyName: string, totalShareUnit: number): number {
    if (ObjectUtil.isEmpty(companyName)) {
      return undefined;
    }
    const matchedNepse = this.nepseList.filter(n => n.companyName === companyName);
    return totalShareUnit ? totalShareUnit * Number(matchedNepse[0].amountPerUnit) : 0;
  }

  private calculateConsideredAmount(totalShareUnit: number, amountPerUnit: number, shareType) {
    if (ObjectUtil.isEmpty(shareType)) {
      return undefined;
    }
    const activeNepse = shareType.toString() === ShareType.PROMOTER.toString()
        ? this.activeNepseMaster.promoter : this.activeNepseMaster.ordinary;
    return ((totalShareUnit * amountPerUnit) / 100) * activeNepse;
  }

  private getShareDataList() {
    const list: Array<CustomerShareData> = [];
    this.shareField.controls.forEach(c => list.push(c.value));
    return list;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      shareField: this.formBuilder.array([]),
      securityOffered: undefined,
      loanShareRate: undefined
    });
    if (!ObjectUtil.isEmpty(this.shareSecurity)) {
      const data = JSON.parse(this.shareSecurity.data);
      this.form.get('securityOffered').setValue(ObjectUtil.setUndefinedIfNull(data.securityOffered));
    }
  }

  private findActiveShareRate() {
    this.shareService.getActiveShare().subscribe(value => {
      if (!ObjectUtil.isEmpty(value.detail)) {
        this.activeNepseMaster = value.detail;
      }
    });
  }
}
