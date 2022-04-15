import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ValuatorService} from '../../../../admin/component/valuator/valuator.service';
import {Valuator} from '../../../../admin/modal/valuator';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';

@Component({
  selector: 'app-security-auto',
  templateUrl: './security-auto.component.html',
  styleUrls: ['./security-auto.component.scss']
})
export class SecurityAutoComponent implements OnInit {
  autoForm: FormGroup = new FormGroup({});
  @Input() securityName: string;
  valuatorList: Array<Valuator> = new Array<Valuator>();

  constructor(private formBuilder: FormBuilder,
              private valuatorService: ValuatorService,
              private toastService: ToastService) { }

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
      model: [undefined],
      manufactureYear: [undefined],
      chasisNo: [undefined],
      engineNo: [undefined],
      valuators: [undefined],
      quotationAmount: [undefined],
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
}
