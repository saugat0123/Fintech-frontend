import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {CadCheckListTemplateEnum} from '../../../admin/modal/cadCheckListTemplateEnum';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {environment} from '../../../../../environments/environment';
import {Clients} from '../../../../../environments/Clients';
import {CurrencyFormatterPipe} from '../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../@core/pipe/nepali-currency-word.pipe';
import {ProposalCalculationUtils} from '../../../loan/component/loan-summary/ProposalCalculationUtils';
import {LoanDataKey} from '../../../../@core/utils/constants/loan-data-key';
import {NepaliNumberAndWords} from '../../model/nepaliNumberAndWords';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {ProgressiveLegalDocConst} from '../../cad-document-template/progressive/progressive-legal-docs/progressive-legal-doc-const';
import {LegalDocumentCheckListEnum} from '../../cad-document-template/icfc/legalDocumentCheckListEnum';

@Component({
    selector: 'app-cad-checklist-doc-template-modal',
    templateUrl: './cad-checklist-doc-template-modal.component.html',
    styleUrls: ['./cad-checklist-doc-template-modal.component.scss']
})
export class CadChecklistDocTemplateModalComponent implements OnInit {
    @Input() documentId;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() customerLoanId: number;
    client = environment.client;
    clientList = Clients;
    nepaliNumber = new NepaliNumberAndWords();

    cadTemplate = CadCheckListTemplateEnum;
    offerLetterConst = ProgressiveLegalDocConst;
    legalTemplate = LegalDocumentCheckListEnum;

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
            const number = ProposalCalculationUtils.calculateTotalFromProposalList(LoanDataKey.PROPOSE_LIMIT, this.cadData.assignedLoan);
            this.nepaliNumber.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
            this.nepaliNumber.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
            this.nepaliNumber.engNumber = number;
        } else {
            this.nepaliNumber = JSON.parse(this.cadData.nepData);
        }

    }
}
