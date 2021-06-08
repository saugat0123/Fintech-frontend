import {Component, Input, OnInit} from '@angular/core';
import {Action} from '../../../../../../@core/Action';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalResponse} from '../../../../../../@core/utils';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";
import {EligibilityLoanConfigServiceService} from "../eligibility-loan-config-service.service";
import {DocumentService} from "../../../document/document.service";
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";
import {Document} from "../../../../modal/document";

@Component({
    selector: 'app-loan-config-form',
    templateUrl: './loan-config-form.component.html',
    styleUrls: ['./loan-config-form.component.scss']
})
export class LoanConfigFormComponent implements OnInit {

    @Input() model: LoanConfigFormComponent;
    @Input() action: Action = Action.ADD;
    finalInitialDocument = Array<Document>();
    loanConfig: FormGroup;
    eligibilityLoanConfig = [];
    documents;

    constructor(private activeModal: NgbActiveModal,
                private router: Router,
                private modalService: NgbModal,
                private formBuilder: FormBuilder,
                private service: EligibilityLoanConfigServiceService,
                private docService: DocumentService) {
    }

    ngOnInit() {

        this.buildForm();
        this.loadData();
        this.setDocuments();

        console.log(this.documents);


    }

    onSubmit(): void {

        if(!ObjectUtil.isEmpty(this.finalInitialDocument)){
            const doc= this.loanConfig.value;
            doc.documents=this.finalInitialDocument;
        }

        this.service.saveEligibilityLoanConfig(this.loanConfig.value).subscribe(resp => {

        })
    }

    buildForm() {
        this.loanConfig = this.formBuilder.group({
            documents:[undefined],
            name: [undefined],
            nature: [undefined],
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
        this.service.getAllEligibilityLoanConfig().subscribe(res => {
            res.detail.forEach(data => {
                if (data.id === id) {
                    data.documents.forEach(doc => {
                        this.documents.forEach(resp => {
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


    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }
}
