import {Component, DoCheck, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../../@core/service/baseservice/common-baseservice';
import {Sector} from '../../../../modal/sector';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';


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
        private activeModal: NgbActiveModal,
        private toastService: ToastService
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

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Sector!'));

                this.sector = new Sector();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/admin/sector']));


            }, error => {

                console.log(error);

                this.modalService.dismissAll(AddSectorComponent);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Sector!'));

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/admin/sector']));

            }
        );
    }

    onClose() {
        this.activeModal.dismiss(AddSectorComponent);
    }
}
