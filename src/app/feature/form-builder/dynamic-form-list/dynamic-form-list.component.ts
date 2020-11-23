import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../@core/service/baseservice/common-pageable';
import {FormGroup} from '@angular/forms';
import {FormBuilderService} from '../service/form-builder.service';
import {PaginationUtils} from '../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';
import {Forms} from '../model/forms';
import {NbDialogService} from '@nebular/theme';
import {DynamicFormsComponent} from '../dynamic-forms/dynamic-forms.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-dynamic-form-list',
    templateUrl: './dynamic-form-list.component.html',
    styleUrls: ['./dynamic-form-list.component.scss']
})
export class DynamicFormListComponent implements OnInit {
    page = 1;
    spinner = false;
    search = {};
    pageable: Pageable = new Pageable();
    isFilterCollapsed = true;
    filterForm: FormGroup;
    formList: Array<Forms> = new Array<Forms>();
    formConfig;
    formTitle;
    parentForm: Forms = new Forms();

    constructor(private formBuilderService: FormBuilderService, private toastService: ToastService,
                private modalService: NbDialogService) {
    }

    static loadData(other: DynamicFormListComponent) {
        other.spinner = true;
        other.formBuilderService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
            other.formList = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            other.spinner = false;
        }, error => {
            console.error(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Form List!'));
            other.spinner = false;
        });
    }

    ngOnInit() {
        DynamicFormListComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        DynamicFormListComponent.loadData(this);
    }

    previewTemplate(template, title, config, model) {
        this.formConfig = JSON.parse(config);
        this.formTitle = title;
        this.parentForm = model;
        this.modalService.open(template, {
            closeOnEsc: false,
            hasScroll: true,
            autoFocus: true
        });

    }

    confirmation(model, template) {
        this.formTitle = model.title;
        this.parentForm = model;
        this.modalService.open(template);
    }

    deleteById(model) {
        this.formBuilderService.delete(model.id).subscribe((res: any) => {
            this.parentForm = new Forms();
            DynamicFormListComponent.loadData(this);
            this.toastService.show(new Alert(AlertType.SUCCESS, res.detail));
        });
    }

}
