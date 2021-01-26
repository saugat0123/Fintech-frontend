import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {CommonService} from '../../../../@core/service/common.service';
import {RouterUtilsService} from '../../utils/router-utils.service';

@Component({
    selector: 'app-profile-view',
    templateUrl: './profile-view.component.html',
    styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
    @Input()
    cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input()
    customerInfoData: CustomerInfoData;
    cadDocumentId;
    spinner = false;
    currentUserLocalStorage = LocalStorageUtil.getStorage().userId;
    @Input()
    toggleArray: { toggled: boolean }[];

    constructor(public commonService: CommonService, public routerUtilsService: RouterUtilsService) {
    }

    ngOnInit() {
    }

}
