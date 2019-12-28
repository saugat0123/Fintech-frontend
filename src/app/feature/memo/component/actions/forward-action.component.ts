import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MemoService} from '../../service/memo.service';
import {ModalResponse} from '../../../../@core/utils';
import {Memo} from '../../model/memo';
import {MemoStage} from '../../model/MemoStage';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../../admin/modal/user';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';

@Component({
    selector: 'app-memo-forward',
    template: `
        <div class="modal-header">
            <h4 class="modal-title pull-left">Forward Memo: {{memo?.subject}}</h4>
            <button (click)="cancel()" aria-label="Close" class="close pull-right" type="button">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <form (ngSubmit)="ok()" [formGroup]="stageForm">
            <div class="modal-body">
                <p>Are you sure you want to forward this memo?</p>
                <hr/>
                <!--<div class="form-group">
                    <ng-select
                            [closeOnSelect]="true"
                            [hideSelected]="true"
                            [items]="roles$"
                            [multiple]="false"
                            bindLabel="name"
                            formControlName="forwardRole"
                            placeholder="Select Role">
                        >
                    </ng-select>
                </div>-->
                <div class="form-group">
                    <ng-select
                            [closeOnSelect]="true"
                            [hideSelected]="true"
                            [items]="users$"
                            [multiple]="false"
                            bindLabel="name"
                            formControlName="sentTo"
                            placeholder="Select User">
                        >
                    </ng-select>
                </div>
                <div class="form-group">
                <textarea class="form-control" placeholder="Note" rows="5"
                          formControlName="note"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button (click)="cancel()" class="btn btn-default" data-dismiss="modal" type="button">No</button>
                <button (click)="ok()" type="submit" class="btn btn-success" data-dismiss="modal">Yes</button>
            </div>
        </form>
    `,
    styles: []
})
export class ForwardActionComponent implements OnInit {

    @Input()
    memo: Memo;

    @Input()
    roles$;

    @Input()
    users$;

    stageForm: FormGroup;

    constructor(private modalRef: NgbActiveModal, private service: MemoService, private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.stageForm = this.formBuilder.group(
            {
                sentTo: [undefined],
                note: [undefined],
                stage: [undefined],
            }
        );
    }


    cancel(): void {
        this.modalRef.dismiss(ModalResponse.CANCEL);
    }

    ok(): void {

        const stage: MemoStage = this.stageForm.getRawValue();
        stage.stage = 'FORWARD';

        const sentBy = new User();
        sentBy.id = parseInt(LocalStorageUtil.getStorage().userId, 10);
        stage.sentBy = sentBy;

        this.memo.stages.push(stage);
        this.memo.stage = stage.stage;

        this.service.update(this.memo.id, this.memo).subscribe(r => {
            this.modalRef.close(ModalResponse.SUCCESS);
        });
    }


}
