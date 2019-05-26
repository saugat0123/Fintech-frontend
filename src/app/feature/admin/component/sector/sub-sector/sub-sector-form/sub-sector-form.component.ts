import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Sector} from '../../../../modal/sector';
import {SubSector} from '../../../../modal/sub-sector';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {SubSectorService} from '../sub-sector.service';
import {SectorService} from '../../sector/SectorService';


@Component({
    selector: 'app-sub-sector-form',
    templateUrl: './sub-sector-form.component.html'
})
export class SubSectorFormComponent implements OnInit, DoCheck {

    @Input()
    model: SubSector;

    task: string;
    submitted = false;
    spinner = false;
    sectorList: Array<Sector>;
    sector: Sector = new Sector();

    constructor(
        private service: SubSectorService,
        private sectorService: SectorService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.sectorService.getAll().subscribe((response: any) => {
            console.log(response.detail);
            this.sectorList = response.detail;
            console.log(this.sectorList);
        });
    }


    ngDoCheck(): void {
        if (this.model.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
            if (this.model.sector != null) {
                this.sector = this.model.sector;
            } else {
                this.sector = new Sector();
            }
        }

    }

    onSubmit() {
        this.submitted = true;
        this.model.sector = this.sector;

        console.log(this.model);
        console.log(this.sector);
        this.service.save(this.model).subscribe(() => {

                this.model = new SubSector();

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
