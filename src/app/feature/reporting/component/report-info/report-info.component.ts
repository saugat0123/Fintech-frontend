import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ReportInfoFormComponent} from '../report-info-form/report-info-form.component';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {ReportingInfo} from '../../model/reporting-info';
import {Action} from '../../../../@core/Action';
import {ReportingInfoService} from '../../service/reporting-info.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-report-info',
    templateUrl: './report-info.component.html',
    styleUrls: ['./report-info.component.scss']
})
export class ReportInfoComponent implements OnInit {
    @Input() reportingInfoType;
    public reportingInfoList: Array<ReportingInfo> = new Array<ReportingInfo>();
    public isFilterCollapsed = true;
    public filterForm: FormGroup;
    private search = {
        // name: undefined,
        reportingInfoType: undefined,
    };

    constructor(
        private dialogService: NgbModal,
        private reportingInfoService: ReportingInfoService,
        private toastService: ToastService,
        private formBuilder: FormBuilder
    ) {
    }

    static loadData(other: ReportInfoComponent) {
        other.getReportingInfo();
    }

    ngOnInit() {
        console.log(this.reportingInfoType);
        ReportInfoComponent.loadData(this);
        this.buildFilterForm();
    }

    public add(report: ReportingInfo) {
        const ref = this.dialogService.open(ReportInfoFormComponent, {size: 'lg', backdrop: 'static'});
        ref.componentInstance.model = report || new ReportingInfo();
        ref.componentInstance.reportingInfoType = this.reportingInfoType;
        ref.componentInstance.action = report ? Action.UPDATE : Action.ADD;

        ModalUtils.resolve(ref.result, ReportInfoComponent.loadData, this);
    }

    public clear(): void {
        this.buildFilterForm();
        ReportInfoComponent.loadData(this);
    }

    public onSearch(): void {
        this.search.reportingInfoType = this.reportingInfoType;
        // this.search.name = ObjectUtil.setUndefinedIfNull(this.filterForm.get('name').value);
        ReportInfoComponent.loadData(this);
    }

    public refreshData($event: boolean) {
        if ($event) {
            this.getReportingInfo();
        }
    }

    private buildFilterForm(): void {
        this.filterForm = this.formBuilder.group({
            name: [undefined]
        });
    }

    private getReportingInfo(): void {
        this.search.reportingInfoType = this.reportingInfoType;
        this.reportingInfoService.getAllWithSearch(this.search).subscribe((response: any) => {
            this.reportingInfoList = response.detail.filter((f) => f.reportingInfoType === this.reportingInfoType);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load reporting info'));
        });
    }
}
