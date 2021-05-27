import {Component, Input, OnInit} from '@angular/core';
import {LoanCycle} from '../../../modal/loan-cycle';
import {Document} from '../../../modal/document';
import {Router} from '@angular/router';
import {DocumentService} from '../document.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Status} from '../../../../../@core/Status';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-update-document',
    templateUrl: './update-document.component.html'
})
export class UpdateDocumentComponent implements OnInit {

    @Input() public cycle;
    title: string;
    selectedDocuments: Array<Document>;
    availableDocumentOptions = [];
    show = false;
    loanCycle: LoanCycle = new LoanCycle();
    selectedDocumentList = Array<number>();
    label: string;
    spinner = false;
    checkAll;
    form: FormGroup;

    constructor(
        private router: Router,
        private service: DocumentService,
        private modalService: NgbModal,
        private toastService: ToastService,
        private formBuilder: FormBuilder
    ) {
    }

    static loadData(other: UpdateDocumentComponent) {
        other.spinner = true;
        other.service.getAllByStatus(Status.ACTIVE).subscribe((response: any) => {
            other.availableDocumentOptions = response.detail;
            other.spinner = false;
            other.initializeOptions();
            other.populateOptionValues(other.loanCycle.id);
        }, error => {
            console.log(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Update Documents'));
        });
    }

    ngOnInit() {
        this.loanCycle = this.cycle;
        this.title = this.loanCycle.cycle;
        this.label = this.loanCycle.label;
        UpdateDocumentComponent.loadData(this);
    }

    initializeOptions() {
        this.form = this.formBuilder.group({});

        this.availableDocumentOptions.forEach(d => {
            const control = new FormControl(0);
            this.form.addControl(d.name, control);
        });
    }

    populateOptionValues(loanCycleId: number) {
        this.service.getByLoanCycleAndStatus(loanCycleId, 'ACTIVE').subscribe((response: any) => {
            this.selectedDocuments = response.detail;
            this.selectedDocuments.forEach(document => {
                this.form.get(document.name).setValue(true);
            });
        });
    }

    unSelectAll($event) {
        this.checkAll = false;
        this.nbUpdateCheckbBox();
        this.save();
    }

    selectAll($event) {
        this.checkAll = true;
        this.nbUpdateCheckbBox();
    }

    nbUpdateCheckbBox() {
        this.availableDocumentOptions.forEach(d => {
            this.form.get(d.name).setValue(this.checkAll);
        });
    }

    updateLoanCycleInBulk() {
        this.service.updateDocumentByLoanCycle(this.loanCycle.id, this.selectedDocumentList)
            .subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Document Loan Cycle'));
            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Update Document Loan Cycle'));
            });
    }

    save() {
        const selectedDocumentValues = [];
        this.spinner = true;
        this.availableDocumentOptions.forEach(d => {
            if (this.form.value[d.name] === true) {
                selectedDocumentValues.push(d.id);
            }
        });
        this.service.updateDocumentByLoanCycle(this.loanCycle.id, selectedDocumentValues)
            .subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Document Loan Cycle'));
                this.router.navigate([this.router.url]);
                this.spinner = false;
            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Update Document Loan Cycle'));
            });
    }
}
