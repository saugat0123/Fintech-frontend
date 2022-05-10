import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {BaseInterest} from '../../base-interest/BaseInterest';
import {Action} from '../../../../../@core/Action';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Pattern} from '../../../../../@core/utils/constants/pattern';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {CoreCapitalService} from '../../../service/core-capital.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
  selector: 'app-capital-configuration-form',
  templateUrl: './capital-configuration-form.component.html',
  styleUrls: ['./capital-configuration-form.component.scss']
})
export class CapitalConfigurationFormComponent implements OnInit {

  @Input() model: BaseInterest;
  @Input() action: Action = Action.ADD;
  spinner = false;
  form: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
      private activeModal: NgbActiveModal,
      private toastService: ToastService,
      private service: CoreCapitalService,
      private el: ElementRef
  ) { }

  ngOnInit() {
    this.buildForm();
  }


  buildForm(): void {
    this.form = this.formBuilder.group({
      coreCapital: this.formBuilder.array([])
    });
    this.addCoreCapital();
  }

  addCoreCapital(){
    const form = this.form.get('coreCapital') as FormArray;

    form.push(this.formBuilder.group({
      rate: [undefined, Validators.required]
    }));
  }

  onClose() {
    this.activeModal.dismiss(ModalResponse.CANCEL);
  }

  get capital(): FormArray
  {
    return this.form.get('coreCapital') as FormArray;
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

  onSubmit(value: any) {
    this.spinner = true;
    if (this.form.invalid) {
      this.spinner = false;
      this.scrollToFirstInvalidControl();
      return;
    }

    this.service.save(this.form.get('coreCapital').value).subscribe(rs =>{
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Core Capital'));
      this.activeModal.close(ModalResponse.SUCCESS);
      this.spinner = false;
    }, error => {
      this.spinner = false;
      this.activeModal.dismiss(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Core Capital'));
    })
  }

  removeForm(i: number) {
    (this.form.get('coreCapital') as FormArray).removeAt(i);
  }
}
