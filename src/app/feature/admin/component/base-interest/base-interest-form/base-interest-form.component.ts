import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {BaseInterest} from '../BaseInterest';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {BaseInterestService} from '../../../service/base-interest.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Action} from '../../../../../@core/Action';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-base-interest-form',
  templateUrl: './base-interest-form.component.html',
  styleUrls: ['./base-interest-form.component.scss']
})
export class BaseInterestFormComponent implements OnInit {

  @Input() model: BaseInterest;
  @Input() action: Action = Action.ADD;
  spinner = false;
  form: FormGroup;

  constructor(private baseInterestService: BaseInterestService,
              private activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private el: ElementRef,
              ) {
  }

  get rate() {
      return this.form.get('rate');
  }

  ngOnInit() {
      this.buildForm();
  }

  buildForm(): void {
      this.form = this.formBuilder.group({
          rate: [undefined, Validators.required]
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

  onSubmit(interest) {
    this.spinner = true;
    if (this.form.invalid) {
          this.scrollToFirstInvalidControl();
          return;
      }
    this.baseInterestService.save(interest).subscribe(() => {
          this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Base Interest'));
          this.activeModal.close(ModalResponse.SUCCESS);
          this.spinner = false;
        }, error => {
          this.spinner = false;
          this.activeModal.dismiss(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Base Interest'));
        }
    );
  }

  onClose() {
    this.activeModal.dismiss(ModalResponse.CANCEL);
  }

}
