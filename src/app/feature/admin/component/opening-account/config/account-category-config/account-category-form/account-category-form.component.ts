import {Component, Input, OnInit} from '@angular/core';
import {AccountCategory} from '../../../../../modal/accountCategory';
import {Action} from '../../../../../../../@core/Action';
import {Violation} from '../../../../../../../@core/utils/modal/Violation';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountCategoryService} from '../../../service/account-category.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../../../@core/utils';
import {CustomValidator} from '../../../../../../../@core/validator/custom-validator';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {AccountType} from '../../../../../modal/accountType';
import {AccountTypeService} from '../../../service/account-type.service';

@Component({
  selector: 'app-account-purpose-form',
  templateUrl: './account-category-form.component.html',
  styleUrls: ['./account-category-form.component.scss']
})
export class AccountCategoryFormComponent implements OnInit {

  @Input() model: AccountCategory;
  @Input() action: Action = Action.ADD;

  errors: Array<Violation>;
  modelForm: FormGroup;
  accountTypeList: Array<AccountType>;
  spinner = false;

  constructor(
      private formBuilder: FormBuilder,
      private service: AccountCategoryService,
      public modalRef: NgbActiveModal,
      private toastService: ToastService,
      private accountTypeService: AccountTypeService
  ) {
  }

  get name() {
    console.log(this.modelForm);
    return this.modelForm.get('name');
  }

  ngOnInit(): void {
    this.accountTypeService.getAll().subscribe((r: any) => {
      this.accountTypeList = r.detail;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load account types'));
    });
    this.buildForm();
  }

  public save() {
    this.spinner = true;
    switch (this.action) {
      case Action.ADD:
        this.model = this.modelForm.value as AccountCategory;
        this.model.accountType = this.getAccountTypeById(this.modelForm.get('accountType').value);
        this.model.additionalInformation = JSON.stringify(this.modelForm.get('additionalInformation').value);
        this.service.save(this.model).subscribe(
            () => {
              this.spinner = false;
              this.modalRef.close(ModalResponse.SUCCESS);
              const alert = new Alert(AlertType.SUCCESS, 'Successfully Saved Account Purpose');
              this.toastService.show(alert);

            }, (err) => {

              if (err.error.errors) {
                this.errors = err.error.errors;
              }
              this.spinner = false;
              const alert = new Alert(AlertType.ERROR, 'Failed to create Account Purpose');
              this.toastService.show(alert);
            }
        );
        break;
      case Action.UPDATE:
        this.model = this.modelForm.value as AccountCategory;
        this.model.accountType = this.getAccountTypeById(this.modelForm.get('accountType').value);
        this.model.additionalInformation = JSON.stringify(this.modelForm.get('additionalInformation').value);
        this.service.update(this.model.id, this.model)
        .subscribe(
            () => {
              this.spinner =  false;
              this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Account Purpose'));

              this.modalRef.close(ModalResponse.SUCCESS);

            }, (err) => {

              console.error(err);

              if (err.error.errors) {
                this.errors = err.error.errors;
              }
              this.spinner = false;
              this.toastService.show(new Alert(AlertType.ERROR, 'Failed to Update Account Purpose'));
            }
        );
        break;
      default:
        console.log(`Invalid Action ${this.action}`);
    }
  }

  public addFeature() {
    (this.modelForm.get(['additionalInformation', 'features']) as FormArray).push(this.getFeatureGroup());
  }

  public getFeatureGroup() {
    return this.formBuilder.group({
      particular: [undefined, [Validators.required]],
      remark: [undefined, [Validators.required]],
    });
  }

  public addNote() {
    (this.modelForm.get(['additionalInformation', 'notes']) as FormArray).push(this.formBuilder.control('', [Validators.required]));
  }

  public deleteFromFormArray(array: FormArray | AbstractControl, index: number) {
    (array as FormArray).removeAt(index);
  }

  private getAccountTypeById(id: number): AccountType {
    const accountType = new AccountType();
    accountType.id = id;
    return accountType;
  }

  private buildForm() {
    this.modelForm = this.formBuilder.group(
        {
          id: [ObjectUtil.setUndefinedIfNull(this.model.id)],
          name: [
            ObjectUtil.setUndefinedIfNull(this.model.name),
            [Validators.required, CustomValidator.notEmpty]
          ],
          accountType: [
            ObjectUtil.isEmpty(this.model.accountType) ? undefined : this.model.accountType.id,
            Validators.required
          ],
          documents: [
            ObjectUtil.setUndefinedIfNull(this.model.documents)
          ],
          additionalInformation: this.formBuilder.group({
            features: this.formBuilder.array([]),
            notes: this.formBuilder.array([]),
          })
        }
    );
    if (!ObjectUtil.isEmpty(this.model.additionalInformation)) {
      const parsedData = JSON.parse(this.model.additionalInformation);
      for (let i = 0; i < parsedData.features.length; i++) {
        this.addFeature();
      }
      for (let i = 0; i < parsedData.notes.length; i++) {
        this.addNote();
      }
      this.modelForm.get('additionalInformation').patchValue(parsedData);
    }
  }
}
