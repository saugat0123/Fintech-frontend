import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {CadCheckListTemplateEnum} from '../../../admin/modal/cadCheckListTemplateEnum';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {CurrencyFormatterPipe} from '../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../@core/pipe/nepali-currency-word.pipe';
import {ProposalCalculationUtils} from '../../../loan/component/loan-summary/ProposalCalculationUtils';
import {LoanDataKey} from '../../../../@core/utils/constants/loan-data-key';
import {NepaliNumberAndWords} from '../../model/nepaliNumberAndWords';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NabilDocumentChecklist} from '../../../admin/modal/nabil-document-checklist.enum';

@Component({
    selector: 'app-cad-checklist-doc-template-modal',
    templateUrl: './cad-checklist-doc-template-modal.component.html',
    styleUrls: ['./cad-checklist-doc-template-modal.component.scss']
})
export class CadChecklistDocTemplateModalComponent implements OnInit {
    @Input() documentId;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() customerLoanId: number;
    nepaliNumber = new NepaliNumberAndWords();

    cadTemplate = CadCheckListTemplateEnum;
    nabilCadTemplate = NabilDocumentChecklist;

    constructor(protected dialogRef: NbDialogRef<CadChecklistDocTemplateModalComponent>,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe) {
    }

    ngOnInit() {
        this.calulation();
    }

    onClose() {
        this.dialogRef.close();
    }

    calulation() {
        if (ObjectUtil.isEmpty(this.cadData.nepData)) {
            const number = ProposalCalculationUtils.calculateTotalFromProposalListKey(this.cadData.assignedLoan);
            this.nepaliNumber.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
            this.nepaliNumber.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
            this.nepaliNumber.engNumber = number;
        } else {
            this.nepaliNumber = JSON.parse(this.cadData.nepData);
        }

    }
}
