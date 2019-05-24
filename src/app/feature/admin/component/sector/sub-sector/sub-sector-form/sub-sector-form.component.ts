import {Component, DoCheck, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../../@core/service/baseservice/common-baseservice';
import {Sector} from '../../../../modal/sector';
import {SubSector} from '../../../../modal/sub-sector';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';


@Component({
    selector: 'app-sub-sector-form',
    templateUrl: './sub-sector-form.component.html'
})
export class SubSectorFormComponent implements OnInit, DoCheck {

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    sectorList: Array<Sector>;
    subSector: SubSector = new SubSector();
    sector: Sector = new Sector();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.commonService.getByAll('v1/sector/getList').subscribe((response: any) => {
            this.sectorList = response.detail;
        });
    }


    ngDoCheck(): void {
        this.subSector = this.dataService.getSubSector();
        if (this.subSector.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
            if (this.subSector.sector != null) {
                this.sector = this.subSector.sector;
            } else {
                this.sector = new Sector();
            }
        }

    }

    onSubmit() {
        this.submitted = true;
        this.subSector.sector = this.sector;
        this.commonService.saveOrEdit(this.subSector, 'v1/subSector').subscribe(result => {

                this.subSector = new SubSector();

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Sub-Sector'));

                this.activeModal.close(ModalResponse.SUCCESS);

            }, error => {

                console.log(error);
                this.activeModal.dismiss(error);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }

}
