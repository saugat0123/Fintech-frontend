import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RelationshipList} from '../../../loan/model/relationshipList';
import {Editor} from '../../../../@core/utils/constants/editor';

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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.configEditor();
    this.buildForm();
  }

  configEditor() {
    this.ckeConfig = Editor.CK_CONFIG;
  }

  private buildForm(): FormGroup {
    return this.hypothecationForm = this.formBuilder.group({
      hypothecationOfStock: this.formBuilder.array([this.hypothecationDetailsFormGroup()])
    });
  }


    public hypothecationDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
                owner: [undefined, Validators.required],
                stock: [undefined],
                value: [undefined],
                otherDetail: [undefined],
                considerValue: 0,
                fairMarketValue: [undefined],
                distressValue: [undefined],
                description: [undefined],
                hypothecationOwnerRelationship: [undefined],
                ownerKycApplicableData: [undefined],
                kycCheckForHypthecation: [false],
            }
        );
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

}
