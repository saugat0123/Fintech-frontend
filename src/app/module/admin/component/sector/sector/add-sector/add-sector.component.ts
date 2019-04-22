import {Component, DoCheck, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../../../shared-service/baseservice/common-baseservice';
import {Sector} from '../../../../modal/sector';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-add-sector',
    templateUrl: './add-sector.component.html',
    styleUrls: ['./add-sector.component.css']
})

export class AddSectorComponent implements OnInit, DoCheck {
    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    sector: Sector = new Sector();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal
    ) {
    }

    ngOnInit() {

    }

    ngDoCheck(): void {
        this.sector = this.dataService.getSector();
        if (this.sector.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.commonService.saveOrEdit(this.sector, 'v1/sector').subscribe(result => {
            this.modalService.dismissAll(AddSectorComponent);
                if (this.sector.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED SECTOR';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED SECTOR';
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.sector = new Sector();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/sector']));


            }, error => {

            this.modalService.dismissAll(AddSectorComponent);

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/sector']));

            }
        );
    }
    onClose() {
        this.activeModal.dismiss(AddSectorComponent);
    }

}
