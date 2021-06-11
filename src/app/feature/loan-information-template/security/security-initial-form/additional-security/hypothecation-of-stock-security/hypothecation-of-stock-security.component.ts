import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RelationshipList} from '../../../../../loan/model/relationshipList';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {Editor} from '../../../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-hypothecation-of-stock-security',
  templateUrl: './hypothecation-of-stock-security.component.html',
  styleUrls: ['./hypothecation-of-stock-security.component.scss']
})
export class HypothecationOfStockSecurityComponent implements OnInit {
  @Input() calendarType: CalendarType;
  hypothecationForm: FormGroup;
  collateralOwnerRelationshipList: RelationshipList = new RelationshipList();
  ckeConfig = Editor.CK_CONFIG;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.hypothecationForm = this.formBuilder.group({
      hypothecationOfStock: this.formBuilder.array([this.hypothecationDetailsFormGroup()])
    });
  }

  private hypothecationDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
      hypothecationOwnerKycCheck: [undefined],
      owner: [undefined],
      stock: [undefined],
      value: [undefined],
      otherDetail: [undefined],
      description: [undefined],
      hypothecationOwnerRelationship: [undefined],
      ownerKyc: [undefined],

        }
    );
  }

  public hypothecationKycRelationInfoCheck(event, index: number): void {
    this.hypothecationForm.get(['hypothecationOfStock', index, 'hypothecationOwnerKycCheck']).setValue(event);
  }

 public removeHypothecationForm(index: number): void {
    (<FormArray>this.hypothecationForm.get('hypothecationOfStock')).removeAt(index);
  }

  public addHypothecationOfStock(): void {
    (this.hypothecationForm.get('hypothecationOfStock') as FormArray).push(this.hypothecationDetailsFormGroup());
  }
}
