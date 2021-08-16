import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {Valuator} from '../../modal/valuator';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ValuatorFormComponent} from './valuator-form/valuator-form.component';
import {UpdateModalComponent} from '../../../../@theme/components';
import {ModalResponse, ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {ValuatorService} from './valuator.service';
import {PermissionService} from '../../../../@core/service/permission.service';
import {InactiveValuatorCommentComponent} from './inactive-valuator-comment/inactive-valuator-comment.component';
import {Status} from '../../../../@core/Status';
import {NbPopoverDirective} from '@nebular/theme';
import {DeleteModalComponent} from '../../../../@theme/components/delete-modal/delete-modal.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {BranchService} from '../branch/branch.service';
import {Branch} from '../../modal/branch';
import {ValuatingField} from '../../modal/valuatingField';
import { NbIconModule} from '@nebular/theme';

@Component({
    selector: 'app-valuator',
    templateUrl: './valuator.component.html'
})
export class ValuatorComponent implements OnInit {
    @ViewChild(NbPopoverDirective, { static: false }) popover: NbPopoverDirective;
    popoverContent = undefined;
    inactiveCodePopoverContent = '';
    inactiveCommentPopoverContent = '';
    page = 1;
    dataList: Array<Valuator>;
    spinner = false;
    globalMsg: string;
    search = {
        name: undefined,
        branchIds: undefined,
        status: undefined,
        valuatingField: undefined,
        minAmount: undefined,
        maxAmount: undefined
    };
    pageable: Pageable = new Pageable();
    activeCount: number;
    inactiveCount: number;
    valuators: number;
    permissions = [];
    isFilterCollapsed = true;
    filterForm: FormGroup;
    branchList: Array<Branch> = new Array<Branch>();
    valuatingFieldEnumObject = ValuatingField.enumObject();
    valueEnum = ValuatingField;

    valuatorForm: FormGroup;
    sabmitted = false;
    popValuator;
    constructor(
        private service: ValuatorService,
        private permissionService: PermissionService,
        private modalService: NgbModal,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        private branchService: BranchService
    ) {
    }
    static loadData(other: ValuatorComponent) {
        other.spinner = true;
        other.service.getStatus().subscribe((response: any) => {
            other.activeCount = response.detail.active;
            other.inactiveCount = response.detail.inactive;
            other.valuators = response.detail.valuators;
        });
        other.service.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
                other.dataList = response.detail.content;
                console.log(response.detail)
                other.pageable = PaginationUtils.getPageable(response.detail);
                other.spinner = false;
            }, error => {
                console.error(error);
                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data'));
                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        console.log('valuator' ,this.valuatingFieldEnumObject);
        console.log('valuator notTTTTTTTTTTTTTT' ,this.valueEnum);
        ValuatorComponent.loadData(this);
        this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
            this.branchList = response.detail;
            this.branchList.sort((a,b) => a.name.localeCompare(b.name));
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
        });
        this.buildFilterForm();
    }

    changePage(page: number) {
        this.page = page;
        ValuatorComponent.loadData(this);
    }

    add() {
        const modalRef = this.modalService.open(ValuatorFormComponent, {size: 'lg'});
        modalRef.componentInstance.model = new Valuator();

        ModalUtils.resolve(modalRef.result, ValuatorComponent.loadData, this);
    }

    edit(valuator: Valuator) {
        const modalRef = this.modalService.open(ValuatorFormComponent, {size: 'lg'});
        modalRef.componentInstance.model = valuator;

        ModalUtils.resolve(modalRef.result, ValuatorComponent.loadData, this);
    }


    onChange(data: Valuator, event) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();

        const modalRef = this.modalService.open(UpdateModalComponent, {size: 'lg'});
        if (data.status === Status.ACTIVE) {
            data.state = null;
        }
        modalRef.componentInstance.data = data;
        modalRef.componentInstance.service = this.service;
        modalRef.result.then(
            close => {
                ValuatorComponent.loadData(this);
            }, dismissMsg => {
                if (dismissMsg === 'openInactiveComment') {
                    const inactiveCommentModalRef = this.modalService.open(InactiveValuatorCommentComponent, {size: 'lg'});
                    inactiveCommentModalRef.componentInstance.data = data;
                    inactiveCommentModalRef.componentInstance.valuatorService = this.service;
                    inactiveCommentModalRef.result.then(
                        () => {
                            ValuatorComponent.loadData(this);
                        }, () => {
                            ValuatorComponent.loadData(this);
                        }
                    );
                }
                ValuatorComponent.loadData(this);
            }
        );
    }

    deleteValuator(valuator: Valuator, event) {
        valuator.status = Status.DELETED;
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();

        const modalRef = this.modalService.open(DeleteModalComponent, {size: 'lg'});
        modalRef.componentInstance.data = valuator;
        modalRef.componentInstance.service = this.service;
        modalRef.result.then(
            close => {
                ValuatorComponent.loadData(this);
            }, dismiss => {
                ValuatorComponent.loadData(this);
            }
        );
    }

    showPopover(event, template, valuator: Valuator) {
        if (event.isShown && (valuator.state === 'BLACKLISTED' || valuator.state === 'SUSPENDED')) {
            this.popoverContent = template;
            this.inactiveCodePopoverContent = valuator.state;
            this.inactiveCommentPopoverContent = valuator.inactiveComment;
            this.popover.content = this.popoverContent;
            this.popover.rebuild();
        } else if (event.isShown && !(valuator.state === 'BLACKLISTED' || valuator.state === 'SUSPENDED')) {
            this.popoverContent = undefined;
        }
    }

    editValuatingType(valuator: Valuator, $event, id) {
        this.popValuator = valuator.valuatingField;
        console.log('STARTTTTTTTTTTT', this.popValuator);
        valuator.multipleValuator = valuator.valuatingField;
        // this.valuatorForm.get('valuator').patchValue(valuator.valuatingField);

        console.log('popValuator',valuator.valuatingField);
        const test = this.popValuator;
        this.valuatorForm = this.formBuilder.group({
            valuatingField: [(ObjectUtil.isEmpty(this.popValuator)
                || ObjectUtil.isEmpty(this.popValuator.valuatingField)) ? undefined :
                this.popValuator.valuatingField, [Validators.required]],
        })
        const modalRef = this.modalService.open($event , {size: 'lg'});
        modalRef.componentInstance.model = new Valuator();

        ModalUtils.resolve(modalRef.result, ValuatorComponent.loadData, this);
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({
            name: [undefined],
            branch: [undefined],
            status: [undefined],
            valuatingField: [undefined],
            minAmount: [undefined],
            maxAmount: [undefined]
        });
    }

    clearSearch() {
        this.buildFilterForm();
        this.onSearch();
        this.isFilterCollapsed = true;
    }

    onSearch() {
        this.search.name = ObjectUtil.setUndefinedIfNull(this.filterForm.get('name').value);
        this.search.branchIds = ObjectUtil.setUndefinedIfNull(this.filterForm.get('branch').value);
        this.search.status = ObjectUtil.setUndefinedIfNull(this.filterForm.get('status').value);
        this.search.valuatingField = ObjectUtil.setUndefinedIfNull(this.filterForm.get('valuatingField').value);
        this.search.minAmount = ObjectUtil.isEmpty(this.filterForm.get('minAmount').value) ? undefined :
            this.filterForm.get('minAmount').value.toString();
        this.search.maxAmount = ObjectUtil.isEmpty(this.filterForm.get('maxAmount').value) ? undefined :
            this.filterForm.get('maxAmount').value.toString();
        ValuatorComponent.loadData(this);
    }
}
