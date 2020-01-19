import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {GroupDetailComponent} from './group-detail/group-detail.component';
import {Group} from '../../../model/group';
import {SecurityDetailComponent} from './security-detail/security-detail.component';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ValuatorService} from '../../../../admin/component/valuator/valuator.service';
import {Proposal} from '../../../../admin/modal/proposal';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';

@Component({
    selector: 'app-group' ,
    templateUrl: './group.component.html' ,
    styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
    @Input() groupValue: Group;
    @Input() proposalDataHolder: Proposal;

    @ViewChild('groupDetail' , {static: false})
    groupDetail: GroupDetailComponent;

    @ViewChild('securityDetail' , {static: false})
    securityDetail: SecurityDetailComponent;

    groupDataForEdit;
    proposalData;
    limit;
    groupBackData = Object;
    modelData: Group = new Group();
    groupGroup: FormGroup;
    solValue;
    valuatorByBranch = [];
    valuatorName = [];

    constructor(
        private groupBuilder: FormBuilder,
        private valuatorService: ValuatorService
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.groupValue)) {
            this.groupDataForEdit = JSON.parse(this.groupValue.data);
            // setSolValue
            this.solValue = this.groupDataForEdit.solDetail;
            this.setSolValue(this.solValue);
            this.groupBackData = this.groupDataForEdit;
            this.modelData.id = this.groupValue.id;
            this.modelData.version = this.groupValue.version;
        }
        if (!ObjectUtil.isEmpty(this.proposalDataHolder)) {
            this.proposalData = JSON.parse(this.proposalDataHolder.data);
        }
        const valuatorSearch = {
            'branchIds': LocalStorageUtil.getStorage().branch
        };
        this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
            this.valuatorByBranch = res.detail;
            if (this.proposalData !== undefined) {
                this.limit = this.proposalData.proposedLimit;
                this.valuatorByBranch.forEach((value) => {
                    if (Number(value.minAmount) <= Number(this.limit) && Number(value.maxAmount) >= Number(this.limit)) {
                        const valuatorList = {id: value.id , name: value.name};
                        this.valuatorName.push(valuatorList);
                    }
                });
            }
        });
    }

    onSubmit() {
        const mergedForm = {
            groupDetail: this.groupDetail.detailGroup.value ,
            securityDetail: this.securityDetail.securityGroup.value ,
            solDetail: this.groupGroup.value ,
        };
        this.modelData.data = JSON.stringify(mergedForm);
    }

    buildForm() {
        this.groupGroup = this.groupBuilder.group({
            note: [undefined] ,
            exposure: [undefined] ,
            totalFmv: [undefined] ,
            percentage: [undefined] ,
            solDv: [undefined] ,
            per: [undefined] ,
        });
    }

    setSolValue(solValue) {
        this.groupGroup = this.groupBuilder.group({
            note: [solValue.note] ,
            exposure: [solValue.exposure] ,
            totalFmv: [solValue.totalFmv] ,
            percentage: [solValue.percentage] ,
            solDv: [solValue.solDv] ,
            per: [solValue.per],
        });
    }
}
