import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanToOrForComponent } from './term-loan-to-or-for.component';

describe('TermLoanToOrForComponent', () => {
  let component: TermLoanToOrForComponent;
  let fixture: ComponentFixture<TermLoanToOrForComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermLoanToOrForComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermLoanToOrForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
