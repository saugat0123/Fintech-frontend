import {Component, EventEmitter, Input, OnInit, Output, ElementRef} from '@angular/core';
import {Cicl, CiclArray} from '../../admin/modal/cicl';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {FormUtils} from '../../../@core/utils/form.utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';
import {Editor} from '../../../@core/utils/constants/editor';
import {RelationshipList} from '../../loan/model/relationshipList';
import {CiclRelationListEnum} from '../../loan/model/ciclRelationListEnum';
import {CalendarType} from '../../../@core/model/calendar-type';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-cicl',
  templateUrl: './cicl.component.html',
  styleUrls: ['./cicl.component.scss']
})
export class CiclComponent implements OnInit {
  @Input() ciclValue: CiclArray;
    // @Input() calendarType: CalendarType;

  @Input() fromProfile: boolean;
  calendarType = CalendarType.AD;

  ciclForm: FormGroup;

  ciclList: Array<Cicl> = new Array<Cicl>();
  @Output() ciclDataEmitter = new EventEmitter();

  submitted = false;
  ckeConfig = Editor.CK_CONFIG;

  relationshipList: RelationshipList = new RelationshipList();
  relationlist;
  // ciclRelation = CiclRelationListEnum.pair();
  ciclHistory = false;
  chargeChecked = false;

  constructor(
      private formBuilder: FormBuilder,
      private toastService: ToastService,
      private el: ElementRef,
      private overlay: NgxSpinnerService
  ) {
  }


  get ciclRemarks() {
    return this.ciclForm.get('ciclRemarks');
  }

  get ciclArray() {
    return this.ciclForm.get('ciclArray');
  }

  get ciclFormControls() {
    return this.ciclForm.controls;
  }


  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.ciclValue)) {
      this.ciclList = JSON.parse(this.ciclValue.data);
      this.setCheckedData(JSON.parse(this.ciclValue.checkedData));
    } else {
      this.ciclValue = new CiclArray();
    }
    const ciclList = this.ciclList[0];
    if (ciclList === undefined) {
        this.ciclHistory = false;
    } else if (ciclList.nameOfBorrower !== null) {
        this.ciclHistory = true;
    }

    this.buildCiclForm();
    this.relationlist = this.relationshipList.relation;
  }
  buildCiclForm() {
    this.ciclForm = this.formBuilder.group({
      ciclArray: this.formBuilder.array([]),
      ciclRemarks: [ObjectUtil.isEmpty(this.ciclValue) ? '' : this.ciclValue.remarks],
      cibCharge: [ObjectUtil.isEmpty(this.ciclValue) ? undefined : this.ciclValue.cibCharge],
      cibDate: [ObjectUtil.isEmpty(this.ciclValue) ? undefined :
          ObjectUtil.isEmpty(this.ciclValue.cibDate) ? undefined : new Date(this.ciclValue.cibDate)]
    });
    if (!ObjectUtil.isEmpty(this.ciclList)) {
      if ((this.ciclList.length > 0)) {
        this.patchCiclFormGroup(this.ciclList);
        this.setBlacklistHistory(this.ciclList);
      } else {
        this.addCiclFormGroup();
      }
    } else {
      this.addCiclFormGroup();
    }
  }

  addCiclFormGroup() {
    const controls = this.ciclForm.controls.ciclArray as FormArray;
    controls.push(
        this.formBuilder.group({
          nameOfBorrower: [undefined, Validators.required],
          borrower: [undefined, Validators.required],
          guarantor: [undefined, Validators.required],
          shareholder: [undefined, Validators.required],
          fiName: [undefined, Validators.required],
          facilityName: [undefined, Validators.required],
          overdueAmount: [undefined, Validators.required],
          outstandingAmount: [undefined, Validators.required],
          // obtaineddate: [undefined, Validators.required],
          overdueStatus: [undefined],
          loanamount: [undefined, Validators.required],
          // overdue: [undefined],
          // ciclRelation: [undefined],
          blacklistChecked: [false],
          blacklistHistory: this.formBuilder.array([]),
            withCcbl: [undefined],
        }));
  }

  addCicl() {
    const controls = this.ciclForm.controls.ciclArray as FormArray;
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fill All CICL Detail To Add More'));
      return;
    }
    controls.push(
        this.formBuilder.group({
          nameOfBorrower: [undefined, Validators.required],
          borrower: [undefined, Validators.required],
          guarantor: [undefined, Validators.required],
          shareholder: [undefined, Validators.required],
          fiName: [undefined, Validators.required],
          facilityName: [undefined, Validators.required],
          overdueAmount: [undefined, Validators.required],
          outstandingAmount: [undefined, Validators.required],
          // obtaineddate: [undefined, Validators.required],
          loanamount: [undefined, Validators.required],
          // overdue: [undefined],
          overdueStatus: [undefined],
          // ciclRelation: [undefined],
          blacklistChecked: [false],
          blacklistHistory: this.formBuilder.array([]),
            withCcbl: [undefined],
        }));
  }

  removeCICL(index: number) {
    (this.ciclArray as FormArray).removeAt(index);
  }

  patchCiclFormGroup(ciclList: Array<Cicl>) {
    const controls = this.ciclForm.controls.ciclArray as FormArray;
    ciclList.forEach((cicl, index) => {
      controls.push(
          this.formBuilder.group({
            nameOfBorrower: [cicl.nameOfBorrower, Validators.required],
            borrower: [cicl.borrower, Validators.required],
            guarantor: [cicl.guarantor, Validators.required],
            shareholder: [cicl.shareholder, Validators.required],
            fiName: [cicl.nameOfFI, Validators.required],
            facilityName: [cicl.facility, Validators.required],
            overdueAmount: [cicl.overdueAmount, Validators.required],
            outstandingAmount: [cicl.outstandingAmount, Validators.required],
            // obtaineddate: [new Date(cicl.obtaineddate), Validators.required],
            loanamount: [cicl.loanamount, Validators.required],
              overdueStatus: [cicl.overdueStatus, Validators.required],
            // overdue: [cicl.overdue],
            // ciclRelation: [cicl.ciclRelation],
            blacklistChecked: [cicl.blacklistChecked],
            blacklistHistory: this.formBuilder.array([]),
              withCcbl: [cicl.withCcbl],
          }));
    });
  }
  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
        'form .ng-invalid'
    );
    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: 'smooth'
    });
    firstInvalidControl.focus();
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }


  onSubmit() {
      this.overlay.show();
  this.submitted = true;
  if (this.ciclHistory === false) {
      const controls = this.ciclForm.controls.ciclArray as FormArray;
      controls.clearAsyncValidators();
      controls.clear();
  }
    if (this.ciclHistory === true) {
        if (this.ciclForm.invalid) {
            this.overlay.hide();
            this.scrollToFirstInvalidControl();
            return;
        }
    }

    // CICL

    this.ciclList = new Array<Cicl>();
    const ciclControls = this.ciclArray as FormArray;
    for (const arrayControl of ciclControls.controls) {
      const controls = (arrayControl as FormGroup).controls;
      const cicl: Cicl = new Cicl();
      cicl.nameOfBorrower = controls.nameOfBorrower.value;
      cicl.borrower = controls.borrower.value;
      cicl.guarantor = controls.guarantor.value;
      cicl.shareholder = controls.shareholder.value;
      cicl.nameOfFI = controls.fiName.value;
      cicl.facility = controls.facilityName.value;
      cicl.overdueAmount = controls.overdueAmount.value;
      cicl.outstandingAmount = controls.outstandingAmount.value;
      // cicl.obtaineddate = controls.obtaineddate.value;
      cicl.loanamount = controls.loanamount.value;
      cicl.overdueStatus = controls.overdueStatus.value;
      // cicl.overdue = controls.overdue.value;
      // cicl.ciclRelation = controls.ciclRelation.value;
      cicl.blacklistChecked = controls.blacklistChecked.value;
      cicl.blacklistHistory = controls.blacklistHistory.value,
          cicl.withCcbl = controls.withCcbl.value,
      this.ciclList.push(cicl);

    }
    // uncomment if value is need
    this.ciclValue.remarks = this.ciclForm.get('ciclRemarks').value === undefined ? '' : this.ciclForm.get('ciclRemarks').value;
    this.ciclValue.cibCharge = this.ciclForm.get('cibCharge').value === undefined ? '' : this.ciclForm.get('cibCharge').value;
    this.ciclValue.cibDate = this.ciclForm.get('cibDate').value === undefined ? '' : this.ciclForm.get('cibDate').value;
      const mergeChecked = {
          chargeChecked: this.chargeChecked,
      };
    this.ciclValue.checkedData = JSON.stringify(mergeChecked);
    this.ciclValue.data = JSON.stringify(this.ciclList);
    this.ciclDataEmitter.emit(this.ciclValue);
  }

  public ciclHistoryFound(ciclChk) {
      if (!ciclChk) {
          this.ciclHistory = false;
      } else {
          this.ciclHistory = true;
      }
  }

    checkChecked(checked) {
        if (checked) {
            this.chargeChecked = true;
        } else {
            this.chargeChecked = false;
        }
    }

    setCheckedData(data) {
        if (!ObjectUtil.isEmpty(data)) {
            this.checkChecked(data['chargeChecked']);
        }
    }

    addBlackList(index) {
      const controls = (<FormArray>(<FormArray>this.ciclForm.get(['ciclArray', index])).get('blacklistHistory'));
      controls.push(
          this.formBuilder.group({
              blacklistNumber: [undefined],
              blacklistDate: [undefined],
              blacklistReleaseDate: [undefined]
          })
      );
    }

    removeBlacklist(index: number, bi: number) {
        (<FormArray>(<FormArray>this.ciclForm.get(['ciclArray', index])).get('blacklistHistory')).removeAt(bi);
    }

    blackListFound(checked: boolean, index: number) {
      if (checked) {
          this.ciclForm.get(['ciclArray', index, 'blacklistChecked']).patchValue(true);
      } else {
          this.ciclForm.get(['ciclArray', index, 'blacklistChecked']).patchValue(false);
      }
    }

    setBlacklistHistory(ciclList: Array<Cicl>) {
      ciclList.forEach((cl, i) => {
          const arr = (<FormArray>(<FormArray>this.ciclForm.get(['ciclArray', i])).get('blacklistHistory'));
          if (!ObjectUtil.isEmpty(cl.blacklistHistory)) {
              cl.blacklistHistory.forEach((bl: any) => {
                  arr.push(this.formBuilder.group({
                      blacklistNumber: [bl.blacklistNumber],
                      blacklistDate: [ObjectUtil.isEmpty(bl.blacklistDate) ? undefined : new Date(bl.blacklistDate)],
                      blacklistReleaseDate: [ObjectUtil.isEmpty(bl.blacklistReleaseDate) ? undefined : new Date(bl.blacklistReleaseDate)],
                  }));
              });
          }
      });
    }
}
