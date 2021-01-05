import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedMultipleComponent } from './loan-deed-multiple.component';

describe('LoanDeedMultipleComponent', () => {
    let component: LoanDeedMultipleComponent;
    let fixture: ComponentFixture<LoanDeedMultipleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LoanDeedMultipleComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoanDeedMultipleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
