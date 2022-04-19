import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValuatorService} from '../../../../admin/component/valuator/valuator.service';
import {Valuator} from '../../../../admin/modal/valuator';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {Auto} from '../../model/auto';
import {CustomerInfoService} from '../../../../customer/service/customer-info.service';
import {TemplateName} from '../../../../customer/model/templateName';

@Component({
  selector: 'app-security-auto',
  templateUrl: './security-auto.component.html',
  styleUrls: ['./security-auto.component.scss']
})
export class SecurityAutoComponent implements OnInit {
  autoForm: FormGroup = new FormGroup({});
  valuatorList: Array<Valuator> = new Array<Valuator>();
  @Input() auto: Array<Auto> = new Array<Auto>();
  submitted = false;
  @Input() customerInfoId: number;

  constructor(private formBuilder: FormBuilder,
              private valuatorService: ValuatorService,
              private toastService: ToastService,
              private customerInfoService: CustomerInfoService) { }

  ngOnInit() {
    this.buildForm();
    this.getAllValuator();
  }

  private getAllValuator(): void {
    this.valuatorService.getAllValuator().subscribe({
      next: (response: any) => {
        this.valuatorList = response.detail;
      },
      error: (error) => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Unable to load district!!!'));
      },
      complete: () => {},
    });
  }

  private buildForm(): FormGroup {
    return this.autoForm = this.formBuilder.group({
      autoSecurity: this.formBuilder.array([this.buildAutoFormGroup()])
    });
  }

  private buildAutoFormGroup(): FormGroup {
    return this.formBuilder.group({
      isNew: [undefined],
      model: [undefined, Validators.required],
      manufactureYear: [undefined, Validators.required],
      chasisNo: [undefined, Validators.required],
      engineNo: [undefined, Validators.required],
      valuators: [undefined],
      quotationAmount: [undefined, Validators.required],
      considerValue: [undefined],
      discountPrice: [undefined],
    });
  }

  public addAuto(): void {
    (this.autoForm.get('autoSecurity') as FormArray).push(this.buildAutoFormGroup());
  }

  public removeAuto(index: number): void {
    (this.autoForm.get('autoSecurity') as FormArray).removeAt(index);
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.autoForm.invalid) {
      this.toastService.show(new Alert(AlertType.WARNING, 'Validation Occurred'));
      return;
    }
    const formArray = this.autoForm.get('autoSecurity') as FormArray;
    formArray.controls.map(val => {
      this.auto.push(val.value);
    });
    this.customerInfoService.saveLoanInfo(this.auto, this.customerInfoId, TemplateName.AUTO_SECURITY)
        .subscribe(() => {
          this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Auto Security!'));
        }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Auto Security!'));
        });
  }
}
