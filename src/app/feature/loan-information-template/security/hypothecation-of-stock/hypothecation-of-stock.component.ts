import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RelationshipList} from '../../../loan/model/relationshipList';
import {Editor} from '../../../../@core/utils/constants/editor';
import {Security} from '../../../loan/model/security';
import {CalendarType} from '../../../../@core/model/calendar-type';

@Component({
  selector: 'app-hypothecation-of-stock',
  templateUrl: './hypothecation-of-stock.component.html',
  styleUrls: ['./hypothecation-of-stock.component.scss']
})
export class HypothecationOfStockComponent implements OnInit {
    hypothecationForm: FormGroup;
    submitted = false;
    collateralOwnerRelationshipList: RelationshipList = new RelationshipList();
    ckeConfig;
    @Input() security: Security;
    @Input() isEdit = false;
    @Input() calendarType: CalendarType;


    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.configEditor();
        this.buildForm();
        if (this.isEdit) {
            this.setHypothecationOfStock();
        } else {
            this.addHypothecationOfStock();
        }
    }

    setHypothecationOfStock() {
        const formData = JSON.parse(this.security.data);
        const hypothecationOfStock = this.hypothecationForm.get('hypothecationOfStock') as FormArray;
        hypothecationOfStock.push(
            this.formBuilder.group({
                stock: [formData.stock],
                value: [formData.value],
                otherDetail: [formData.otherDetail],
                considerValue: [formData.considerValue],
                stockMarketValue: [formData.stockMarketValue],
                fairMarketValue: [formData.fairMarketValue],
                distressValue: [formData.distressValue],
                description: [formData.description],
                bookValue: [formData.bookValue],
                realiasableRate: [formData.realiasableRate],
                realiasableValue: [formData.realiasableValue],
                stockRealiasableValue: [formData.stockRealiasableValue],
                averageStock: [formData.averageStock],
                receivableBookValue: [formData.receivableBookValue],
                receivableMarketValue: [formData.receivableMarketValue],
                receivableRealizableRate: [formData.receivableRealizableRate],
                receivableRealizableValue: [formData.receivableRealizableValue]
            })
        );
    }

  configEditor() {
    this.ckeConfig = Editor.CK_CONFIG;
  }

  private buildForm(): FormGroup {
    return this.hypothecationForm = this.formBuilder.group({
      hypothecationOfStock: this.formBuilder.array([])
    });
  }


    public hypothecationDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
                owner: [undefined, Validators.required],
                stock: [undefined],
                value: [undefined],
                otherDetail: [undefined],
                considerValue: 0,
                stockMarketValue: 0,
                fairMarketValue: [undefined],
                distressValue: [undefined],
                description: [undefined],
                hypothecationOwnerRelationship: [undefined],
                ownerKycApplicableData: [undefined],
                kycCheckForHypthecation: [false],
                hypothecationFirstValuationDate: [undefined],
                bookValue: [undefined],
                realiasableRate: [undefined],
                realiasableValue: [undefined],
                stockRealiasableValue: [undefined],
                averageStock: [undefined],
                receivableBookValue: [undefined],
                receivableMarketValue: [undefined],
                receivableRealizableRate: [undefined],
                receivableRealizableValue: [undefined],
            });
    }

 public ownerKycRelationInfoCheck(kycCheck, kycCheckId, index): void {
    // if (kycCheckId === 'land') {
    //   this.ownerKycRelationInfoCheckedForLand = true;
    // }
    // if (kycCheckId === 'land_building') {
    //   this.ownerKycRelationInfoCheckedForLandBuilding = true;
    // }
    // if (kycCheckId === 'hypothecation') {
    //   this.ownerKycRelationInfoCheckedForHypothecation = true;
    // }
  }

  public addHypothecationOfStock(): void {
    (this.hypothecationForm.get('hypothecationOfStock') as FormArray).push(this.hypothecationDetailsFormGroup());
  }

  public removeHypothecation(index: number): void {
    (<FormArray>this.hypothecationForm.get('hypothecationOfStock')).removeAt(index);
  }

    public onChange(i, stock, rec, patchKey) {
        const total = this.hypothecationForm.get(['hypothecationOfStock', i, stock]).value + this.hypothecationForm.get(['hypothecationOfStock', i, rec]).value ;
        this.hypothecationForm.get(['hypothecationOfStock', i, patchKey]).patchValue(total);
    }
}
