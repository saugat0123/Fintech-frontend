import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreExportLoanComponent } from './pre-export-loan.component';

describe('PreExportLoanComponent', () => {
  let component: PreExportLoanComponent;
  let fixture: ComponentFixture<PreExportLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreExportLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreExportLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
