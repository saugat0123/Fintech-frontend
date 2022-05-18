import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {SecurityLoanReferenceService} from '../../../security-service/security-loan-reference.service';
import {SecurityTaggerComponent} from './security-tagger/security-tagger.component';

@Component({
    selector: 'app-security-adder',
    templateUrl: './security-adder.component.html',
    styleUrls: ['./security-adder.component.scss']
})
export class SecurityAdderComponent implements OnInit, OnChanges {
    @Input() customerInfo: CustomerInfoData;
    @Input() loanHolder: LoanDataHolder;
    @Input() proposedAmount: number;
    @ViewChild('securityTaggerComponent', {static: false}) securityTagger: SecurityTaggerComponent;
    @Output() tagSecurityEmitter = new EventEmitter();
    @Output() deleteEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    proposedLimit: number;
    spinner = false;
    deleteTaggedSecurity = false;

    constructor(private fb: FormBuilder,
                private securityLoanReferenceService: SecurityLoanReferenceService,
                private change: ChangeDetectorRef) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.proposedLimit = changes.proposedAmount.currentValue;
        this.change.detectChanges();
    }

    save() {
        this.loanHolder.securities = this.securityTagger.securityList;
        this.tagSecurityEmitter.emit(this.loanHolder);
    }

    public catchEmit(event): void {
        this.deleteEmitter.emit(true);
    }
}
