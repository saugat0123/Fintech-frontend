import {Component, Input, OnInit} from '@angular/core';
import {ToastService} from '../../../@core/utils';
import {CustomerOfferLetter} from '../../loan/model/customer-offer-letter';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerOfferLetterService} from '../../loan/service/customer-offer-letter.service';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {User} from '../../admin/modal/user';
import {DocStatus} from '../../loan/model/docStatus';
import {Router} from '@angular/router';
import {CadLoginComponent} from '../cad-login/cad-login.component';

@Component({
    selector: 'app-post-approval-doc-approve',
    templateUrl: './post-approval-doc-approve.component.html',
    styleUrls: ['./post-approval-doc-approve.component.scss']
})
export class PostApprovalDocApproveComponent implements OnInit {

    @Input() customerOfferLetter: CustomerOfferLetter;
    approveForm: FormGroup;
    cadDocumentIDs: number[] = [];
    disableButton = true;
    showHideFinalApprove = false;
    showHideFinalApproveComment = false;
    submitted = false;


    constructor(private toastService: ToastService,
                private modalService: NgbModal,
                private formBuilder: FormBuilder,
                private route: Router,
                private service: CustomerOfferLetterService) {
    }

    ngOnInit() {
        this.buildForm();
    }

    onClose() {
        this.modalService.dismissAll();
    }

    buildForm() {
        this.approveForm = this.formBuilder.group(
            {
                customerLoanId: [this.customerOfferLetter.customerLoan.id],
                docAction: ['APPROVED'],
                comment: [undefined, Validators.required],
                documentStatus: [DocStatus.APPROVED]
            });
    }

    updateCadDocumentIDsList(id: number, checked: boolean) {
        if (this.cadDocumentIDs.includes(id) && !checked) {
            const index = this.cadDocumentIDs.findIndex((d) => d === id);
            this.cadDocumentIDs.splice(index, 1);
        } else if (!this.cadDocumentIDs.includes(id) && checked) {
            this.cadDocumentIDs.push(id);
        }
        if (this.cadDocumentIDs.length < 1) {
            this.disableButton = true;
        } else {
            this.disableButton = false;
        }
        this.checkWhetherAllDocAreApproved(id, checked);
    }

    async onSubmit() {
        this.submitted = true;
        this.disableButton = true;
        if (this.cadDocumentIDs.length < 1) {
            return;
        }
        if (this.showHideFinalApproveComment
            && this.showHideFinalApprove
            && this.approveForm.invalid) {
            return;
        }
        const modelRef = this.modalService.open(CadLoginComponent, {
            backdrop: 'static',
            keyboard: false
        });
        await modelRef.componentInstance.returnAuthorizedState.subscribe((res: boolean) => {
            if (res) {
                this.saveApprovedDoc();
            } else {
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to take action ! Please Try again'));
            }
        });

    }

    saveApprovedDoc() {
        this.service.postOfferLetterPartialDocument(this.cadDocumentIDs).subscribe((res: any) => {
            if (this.showHideFinalApproveComment && this.showHideFinalApprove) {
                this.service.postOfferLetterAction(this.approveForm.value).subscribe((response: any) => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                        this.approveForm.get('docAction').value));
                    this.route.navigate(['home/loan/loan-offer-letter']);
                }, error => {
                    this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

                });
                this.onClose();
            } else {
                this.toastService.show(new Alert(AlertType.SUCCESS, res.detail));
            }

        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
    }

    checkWhetherAllDocAreApproved(id, checked) {
        const document = this.customerOfferLetter.customerOfferLetterPath;
        const documentConfig = this.customerOfferLetter.customerLoan.loan.offerLetters;
        const selectedElement = document.filter(s => s.id === id);
        if (!ObjectUtil.isEmpty(selectedElement) && selectedElement.length > 0) {
            const user: User = new User();
            user.name = LocalStorageUtil.getStorage().userFullName;
            document.filter(s => s.id === id)[0].isApproved = checked;
            if (checked) {
                document.filter(s => s.id === id)[0].lastModifiedAt = new Date();
                document.filter(s => s.id === id)[0].approvedBy = user;
            } else {
                document.filter(s => s.id === id)[0].approvedBy = null;
            }
        }

        const approvedArray = [];
        documentConfig.forEach(dc => {
            const innerElement = document.filter(d => (d.offerLetter.id === dc.id) && d.isApproved);
            if (!ObjectUtil.isEmpty(innerElement)) {
                if (innerElement.length > 0) {
                    approvedArray.push(innerElement[0]);
                }

            }

        });

        this.showHideFinalApprove = approvedArray.length === documentConfig.length;
        if (!this.showHideFinalApprove) {
            this.showHideFinalApproveComment = false;
        } else {
            this.showHideFinalApproveComment = true;
        }

    }

    isAllApproved(checked: boolean) {
        this.showHideFinalApproveComment = checked;
    }

    checkCommentIsEmpty() {
        const val = this.approveForm.controls['comment'].value;
        if (!ObjectUtil.isEmpty(val)) {
            this.disableButton = false;
        } else {
            this.disableButton = true;
        }

    }

}
