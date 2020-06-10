import {Component, Input, OnInit} from '@angular/core';
import {AccountCategory} from '../../../../../modal/accountCategory';
import {Action} from '../../../../../../../@core/Action';
import {Violation} from '../../../../../../../@core/utils/modal/Violation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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

  constructor(
      private formBuilder: FormBuilder,
      private service: AccountCategoryService,
      private modalRef: NgbActiveModal,
      private toastService: ToastService,
      private accountTypeService: AccountTypeService
  ) {
  }

  get name() {
    return this.modelForm.get('name');
  }

  ngOnInit(): void {
    this.accountTypeService.getAll().subscribe((r: any) => {
      this.accountTypeList = r.detail;
      console.log(this.accountTypeList);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load account types'));
    });
    this.buildForm();
  }

  buildForm() {
    this.modelForm = this.formBuilder.group(
        {
          id: [ObjectUtil.setUndefinedIfNull(this.model.id)],
          name: [
            ObjectUtil.setUndefinedIfNull(this.model.name),
            [Validators.required, CustomValidator.notEmpty]
          ],
          accountType: [
              this.model.accountType === undefined ? undefined : this.model.accountType.id,
              Validators.required
          ]
        }
    );
  }

  save() {
    switch (this.action) {
      case Action.ADD:
        this.model = this.modelForm.value as AccountCategory;
        this.model.accountType = this.getAccountTypeById(this.modelForm.get('accountType').value);
        this.service.save(this.model).subscribe(
            () => {

              this.modalRef.close(ModalResponse.SUCCESS);
              const alert = new Alert(AlertType.SUCCESS, 'Successfully Saved Account Purpose');
              this.toastService.show(alert);

            }, (err) => {

              if (err.error.errors) {
                this.errors = err.error.errors;
              }

              const alert = new Alert(AlertType.ERROR, 'Failed to create Account Purpose');
              this.toastService.show(alert);
            }
        );
        break;
      case Action.UPDATE:
        this.model.name = this.modelForm.get('name').value;
        this.model.accountType = this.getAccountTypeById(this.modelForm.get('accountType').value);
        this.service.update(this.model.id, this.model)
        .subscribe(
            () => {
              this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Account Purpose'));

              this.modalRef.close(ModalResponse.SUCCESS);

            }, (err) => {

              console.error(err);

              if (err.error.errors) {
                this.errors = err.error.errors;
              }

              this.toastService.show(new Alert(AlertType.ERROR, 'Failed to Update Account Purpose'));
            }
        );
        break;
      default:
        console.log(`Invalid Action ${this.action}`);
    }
  }

  private getAccountTypeById(id: number): AccountType {
    const accountType = new AccountType();
    accountType.id = id;
    return accountType;
  }

  close() {
    this.modalRef.dismiss();
  }

}
