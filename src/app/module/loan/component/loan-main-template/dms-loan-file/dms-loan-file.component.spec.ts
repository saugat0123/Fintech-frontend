import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmsLoanFileComponent } from './dms-loan-file.component';

describe('DmsLoanFileComponent', () => {
  let component: DmsLoanFileComponent;
  let fixture: ComponentFixture<DmsLoanFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmsLoanFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmsLoanFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
