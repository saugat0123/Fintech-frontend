import {Component, Input, OnInit} from '@angular/core';
import {Action} from '../../../../../../@core/Action';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";
import {EligibilityLoanConfigService} from "../eligibility-loan-config-service";
import {DocumentService} from "../../../document/document.service";
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";
import {Document} from "../../../../modal/document";
import {EligibilityLoanConfiguration} from "../EligibilityLoanConfiguration";
import {Alert, AlertType} from "../../../../../../@theme/model/Alert";
import {Violation} from "../../../../../../@core/utils/modal/Violation";

@Component({
    selector: 'app-loan-config-form',
    templateUrl: './loan-config-form.component.html',
    styleUrls: ['./loan-config-form.component.scss']
})
export class LoanConfigFormComponent implements OnInit {

    @Input() action: Action = Action.ADD;
    finalInitialDocument = Array<Document>();
    loanConfig: FormGroup;
    eligibilityLoanConfig = [];
    documents = [];
    @Input() loanId;
    @Input() model: EligibilityLoanConfiguration;
    error: Array<Violation>;

    spinner=false;


    constructor(private activeModal: NgbActiveModal,
                private router: Router,
                private modalService: NgbModal,
                private formBuilder: FormBuilder,
                private service: EligibilityLoanConfigService,
                private docService: DocumentService,
                private modelref: NgbActiveModal,
                private toast: ToastService) {
    }

    ngOnInit() {
        this.buildForm();
        this.loadData();
        this.setDocuments();

        this.documents.forEach(data => {
            console.log(data);
        })

    }

    onSubmit(): void {


        switch (this.action) {
            case Action.ADD:
                this.spinner=true;
                if(!ObjectUtil.isEmpty(this.finalInitialDocument)){
                    const doc= this.loanConfig.value;
                    doc.documents=this.finalInitialDocument;
                }

                this.service.saveEligibilityLoanConfig(this.loanConfig.value).subscribe(resp => {
                    this.loadData();
                    this.modelref.close(ModalResponse.SUCCESS);
                     const alert= new Alert(AlertType.SUCCESS, 'Successfully Saved Eligibility Loan ')
                        this.toast.show(alert);
                     this.spinner=false;
                    this.router.navigate([this.router.url]);

                },(err) => {
                    if (err.error.errors) {
                        this.error = err.error.errors;
                    }
                    this.modelref.close(ModalResponse.ERROR);
                    this.toast.show(new Alert(AlertType.ERROR, 'Failed to create Eligibility Loan'));
                    this.router.navigate([this.router.url]);
                });

                break;

            case Action.UPDATE:
                if(!ObjectUtil.isEmpty(this.finalInitialDocument)){
                    const doc= this.loanConfig.value;
                    this.model.documents=this.finalInitialDocument;
                }
                this.model.name = this.loanConfig.get('name').value;
                this.model.nature = this.loanConfig.get('nature').value;
                this.service.saveEligibilityLoanConfig(this.model).subscribe(resp => {
                    this.modelref.close(ModalResponse.SUCCESS);
                    this.toast.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Eligibility Loan '));
                    this.router.navigate([this.router.url]);
                }, (err) => {
                    if (err.error.errors) {
                        this.error = err.error.errors;
                    }
                    this.modelref.close(ModalResponse.ERROR);
                    this.toast.show(new Alert(AlertType.ERROR, 'Failed Update Eligibility Loan'));
                    this.router.navigate([this.router.url]);
                })


        }

    }

    buildForm() {
        this.loanConfig = this.formBuilder.group({
            documents:[undefined],
            id:[this.model.id=== undefined ? '': this.model.id],
            name: [this.model.name=== undefined ? '' : this.model.name],
            nature: [this.model.nature===undefined ? '' : this.model.nature],
        });
    }

    loadData() {
        this.service.getAllEligibilityLoanConfig().subscribe(resp => {
            console.log(resp);
            this.eligibilityLoanConfig = resp.detail;
        })
    }

    setDocuments(): void {
        this.docService.getAllLoanCycle().subscribe(reponse => {
            reponse.detail.forEach(data => {
                if (data.cycle === 'Eligibility') {
                    this.getActiveDocuments(data.id);
                }
            });
        });
    }

    getActiveDocuments(id: number): void {
        this.docService.getByLoanCycleAndStatus(id, 'ACTIVE').subscribe(resp => {
            this.documents = resp.detail;
            this.checkDocument(this.loanId);
        })
    }


    nbUpdateCheckBoxInitial($event, checkAll) {
        this.finalInitialDocument = [];
        this.documents.forEach((d) => {
            if (checkAll) {
                this.finalInitialDocument.push(d);
                Object.assign(d, {checked: true});
            } else {
                d.checked = false;
                this.finalInitialDocument = [];
            }
        });

    }

    updateDocument(events, document: Document, documentArray: Document[]) {
        if (events.target.checked === true) {
            documentArray.push(document);
        } else {
            const index: number = documentArray.indexOf(document);
            if (index !== -1) {
                documentArray.splice(index, 1);
            }
        }
    }

    checkDocument(id: number) {
        if (this.documents.length >= 0) {
            this.service.getAllEligibilityLoanConfig().subscribe(res => {
                console.log(res.detail);
                res.detail.forEach(data => {
                    if (data.id === id) {
                        data.documents.forEach(doc => {

                            this.documents.forEach(resp => {
                                console.log(resp);
                                if (resp.id === doc.id) {
                                    resp.checked = true;
                                    this.finalInitialDocument.push(resp);
                                }
                            });

                        });
                    }
                });
            });
        }
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }
}
