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
import {Editor} from '../../../../@core/utils/constants/editor';
import {CustomerShareData} from '../../../admin/modal/CustomerShareData';
import {ShareSecurity} from '../../../admin/modal/shareSecurity';
import {CustomerShareBatch} from '../../../admin/modal/customer-share-batch';
import {Status} from '../../../../@core/Status';

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
  ckEdittorConfig;
  displayChecklist: string = null;
  tableHeads = [];
  allChecklistId = [];
  finalTableList: any = [];
  customerShareData: Array<CustomerShareData> = new Array<CustomerShareData>();
  shareSecurity: Array<ShareSecurity> = new Array<ShareSecurity>();
  customerShareBatch = new CustomerShareBatch();
  @Input() customerBatch: Array<CustomerShareBatch>;
  toggleArray: {
    ownerName: any,
  } [] = [];


  constructor(private formBuilder: FormBuilder,
              private shareService: NepseService,
              private nepsePriceInfoService: NepsePriceInfoService,
              private toastService: NbToastrService,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.ckEdittorConfig = Editor.CK_CONFIG;
    this.buildForm();
    this.getNepseList();
    this.getLastNepsePriceInfo();
    this.getActiveShare();
    if (this.customerBatch.length >= 1) {
      this.setShareDetails();
    }
    /*if (!ObjectUtil.isEmpty(this.security)) {
      this.setShareSecurityData();
    } else {
      this.addShareSecurity();
    }*/
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
      // this.shareSecurityForm.get('sharePriceDate').patchValue(this.datePipe.transform(this.nepsePriceInfo.sharePriceDate, 'yyyy-MM-dd'));
      // this.shareSecurityForm.get('avgDaysForPrice').patchValue(this.nepsePriceInfo.avgDaysForPrice);
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
     /* shareSecurityDetails: this.formBuilder.array([]),
      loanShareRate: [undefined],
      sharePriceDate: [undefined],
      avgDaysForPrice: [undefined],*/
      securityOffered: [undefined],
      netPositionDetails: [undefined],
    });
  }

  private setShareSecurityData(): void {
    const formControl = this.shareSecurityForm.get('shareSecurityDetails') as FormArray;
    const data = JSON.parse(this.security.data);
    formControl.push(
        this.formBuilder.group({
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
          shareSecurityFirstValuationDate: [data.shareSecurityFirstValuationDate ? new Date(data.shareSecurityFirstValuationDate) : '']
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
    /*this.shareField.at(index).patchValue({
      total: totalShareUnit * amountPerUnit,
      drawingPower: this.calculateConsideredAmount(totalShareUnit, amountPerUnit, shareType)
    });*/
    this.calcRealiasable(index, 'share');
  }

  public calcRealiasable(i, key): void {
    if (key === 'share') {
      const reliasableValue = (Number(this.shareSecurityForm.get(['shareSecurityDetails', i, 'total']).value)
          * (Number(this.shareSecurityForm.get(['shareSecurityDetails', i, 'shareRate']).value) / 100));
      // this.shareSecurityForm.get(['shareSecurityDetails', i, 'considerValue']).patchValue(reliasableValue);
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

  dynamicChecklist(data: string) {
    this.customerShareData = new Array<CustomerShareData>();
    let elem;
    this.allChecklistId = [];
    this.finalTableList = [];
    this.toggleArray = [];
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(data, 'text/html');
    let totalInput = 0;
    // seperating tables from overal html
    const tables = Array.from(parsedDocument.getElementsByTagName('table'));
    tables.forEach((element, table) => {
      this.tableHeads = [];
      // selecting all tr from table
      const tr = Array.from(element.getElementsByTagName('tbody'))[0].getElementsByTagName('tr');
      // first row header data
      const tds = tr[0].getElementsByTagName('td');
      for (let i = 0; i < tds.length; i++) {
        const f: string = tds[i].innerText.split('\n').join('').split('\t').join('');
        if (f.toLowerCase() === 'yes' || f.toLowerCase() === 'no' || f.toLowerCase() === 'na') {
          totalInput += 1;
        }
        // pushing data to array for comparing
        this.tableHeads.push(f);
      }


      /* Retriving the data from table row :: */
      const lastFinalTest = [];
      for (let i = 0; i < tr.length; i++) {
        const finalTrData = [];
        if (i > 0) {
          const rowTd = tr[i].getElementsByTagName('td');
          const test = [];
          const tempData = {};
          for (let j = 0; j < rowTd.length; j++) {
            const tempVarName = this.tableHeads[j];
            tempData[tempVarName] = rowTd[j].innerText.split('\n').join('').split('\t').join('');
            const testData = rowTd[j].innerText.split('\n').join('').split('\t').join('');
            if (testData !== ' ') {
              if (testData === '-' && test[j - 1] !== 'Total' || testData === 'SN') {
                lastFinalTest.splice(i - 1, 1);
                break;
              }
              let clearedData: any = testData;
              if (j >= 4) {
                clearedData = testData.replace(/\s/g, '');
                clearedData = clearedData === '-' ? Number(0) : clearedData;
                if (clearedData === 'Ordinary' || clearedData === 'Promoter') {
                  clearedData = clearedData === 'Ordinary' ? 'ORDINARY' : 'PROMOTER';
                }
                if (testData.includes(',')) {
                  clearedData = Number(clearedData.split(',').join('')) ?
                      Number(clearedData.split(',').join('')) : 0;
                }
              }
              test.push(clearedData);
            }
          }
          if (test.length > 1) {
            test.shift();
            lastFinalTest.push(test);
          }
        }
        // lastFinalTest.push(finalTrData);
      }
      if (lastFinalTest.length > 1) {
        this.toggleArray.push({
          ownerName: typeof lastFinalTest[lastFinalTest.length - 1][0] === 'string' ?
              lastFinalTest[lastFinalTest.length - 1][0] : ''
        });
        lastFinalTest.pop();
        this.finalTableList.push(lastFinalTest);
      }


      for (let index = 0; index < tr.length; index++) {
        const tdData = tr[index].getElementsByTagName('td');
        let prev: HTMLCollectionOf<HTMLTableDataCellElement>;
        if (index > 0) {
          prev = tr[index - 1].getElementsByTagName('td');
          if (tdData.length < prev.length) {
            const difference = prev.length - tdData.length;
            if (tdData.length !== this.tableHeads.length) {
              this.tableHeads.splice(0, difference);
            }
          }
          if (tdData.length > prev.length) {
            const difference = tdData.length - prev.length;
            if (difference !== prev.length && tdData.length !== this.tableHeads.length) {
              for (let dif = 0; dif < difference; dif++) {
                this.tableHeads.splice(dif, 0, 'i');
              }
            }
          }
        }
        /*for (let j = 0; j < tdData.length; j++) {

          // text values of  rows
          const da = tdData[j].innerText.split('\n').join('').split('\t').join('');
          // for skipping row containing yes no
          if ((da.toLowerCase() === 'yes') && index > 0) {
            this.tableHeads = [];
            const newTdData = tr[index + 1].getElementsByTagName('td');
            totalInput = 0;
            for (let l = 0; l < newTdData.length; l++) {
              /!* This is the test data for the td value *!/
              if (!ObjectUtil.isEmpty(tdData[l - 1])) {
                const dat = tdData[l - 1].innerText.split('\n').join('').split('\t').join('');
                if (dat.toLowerCase() === 'yes' || dat.toLowerCase() === 'no' || dat.toLowerCase() === 'na') {
                  totalInput += 1;
                  this.tableHeads.push(dat);
                } else {
                  this.tableHeads.push('x');
                }
              }
            }
          }
        }*/
      }
      this.tableHeads = [];
      // @ts-ignore
      elem += '<div class="row">  <table class="table text-center table-responsive d-flex justify-content-center">'
          + element.innerHTML.split('page-break-after:always').join(' ') + '</table> </div>  <br style="clear: both;"> ';
    });
    if (ObjectUtil.isEmpty(elem)) {
      this.displayChecklist = null;
    } else {
      this.displayChecklist = elem.replace('undefined', ' ');
    }
    this.convertArrayToObj(this.finalTableList);
  }

  setShareDetails() {
    const activeShareData = this.customerBatch.filter((data) => data.status === Status.ACTIVE);
    const parsedFormData = !ObjectUtil.isEmpty(activeShareData) ? JSON.parse(activeShareData[activeShareData.length - 1].data)
      : activeShareData;
    if (!ObjectUtil.isEmpty(parsedFormData)) {
      this.shareSecurityForm.patchValue(parsedFormData);
      this.displayChecklist = this.shareSecurityForm.get('netPositionDetails').value;
      this.customerShareBatch = activeShareData[activeShareData.length - 1];
    }
    // this.shareSecurityForm.get('netPositionDetails').patchValue(activeShareData[0].data);
    // this.shareSecurityForm.get('securityOffered').patchValue(activeShareData[0].otherDetails);
  }

  convertArrayToObj(data) {
    // this.customerShareBatch = new CustomerShareBatch();
    const dataLen = !ObjectUtil.isEmpty(data) ? data.length : 0;
    if (data.length > 1) {
      const temp = [];
      data.forEach((val, idx) => {
        // if ()
        const obj = Object.assign({}, val);
        temp.push(obj);
      });
    }
    /* Another method for transforming into another test */
    this.shareSecurity = new Array<ShareSecurity>();
    if (dataLen > 0) {
      data.forEach((val, indx) => {
        const peopleObjects = val
            .map(([companyName, companyCode, shareType, totalShareUnit, fmv, drawingAmount, realizableAmount]) =>
                ({companyName, companyCode, shareType, totalShareUnit, fmv, drawingAmount, realizableAmount }));
        this.customerShareData = peopleObjects;
        const shareSecurity = new ShareSecurity();
        shareSecurity.customerShareData = this.customerShareData;
        /* For the total calculation */
        const calcVal = this.calTotalVal(shareSecurity.customerShareData, this.toggleArray[indx].ownerName);
        shareSecurity.data = !ObjectUtil.isEmpty(calcVal) ? JSON.stringify(calcVal)
            : JSON.stringify({ownerName: '', totalNoShare: 0, totalFmv: 0, totalDrawingAmount: 0, totalRealizableAmount: 0});
        this.shareSecurity.push(shareSecurity);
      });
      this.customerShareBatch.shareSecurity = this.shareSecurity;
      this.customerShareBatch.status = Status.ACTIVE;
      this.customerShareBatch.data = JSON.stringify(this.shareSecurityForm.value);
    }
  }

  calTotalVal(shareData, ownerName) {
    const tempData = {ownerName: '', totalNoShare: 0, totalFmv: 0, totalDrawingAmount: 0, totalRealizableAmount: 0};
    tempData.ownerName = !ObjectUtil.isEmpty(ownerName) ? ownerName.toString() : '';
    tempData.totalNoShare = shareData.map(data => data.totalShareUnit).reduce((a, b) => Number(a) + Number(b), 0);
    tempData.totalFmv = shareData.map(data => data.fmv).reduce((a, b) => Number(a) + Number(b), 0);
    tempData.totalDrawingAmount = shareData.map(data => data.drawingAmount).reduce((a, b) => Number(a) + Number(b), 0);
    tempData.totalRealizableAmount = shareData.map(data => data.realizableAmount).reduce((a, b) => Number(a) + Number(b), 0);
    return tempData;
    // if ()
  }

  setRemarkToObj() {
    this.customerShareBatch.data = JSON.stringify(this.shareSecurityForm.value);
  }

  clearData() {
    this.shareSecurityForm.get('netPositionDetails').patchValue(undefined);
    this.displayChecklist = null;
/*    if (!ObjectUtil.isEmpty(this.customerShareBatch)) {
      // this.customerShareBatch.shareSecurity = new Array<ShareSecurity>();
      // this.setRemarkToObj();
    }*/
  }

}
