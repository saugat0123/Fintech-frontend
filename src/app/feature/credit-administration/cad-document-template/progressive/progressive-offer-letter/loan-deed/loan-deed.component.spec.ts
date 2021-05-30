import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedComponent } from './loan-deed.component';

describe('LoanDeedComponent', () => {
  let component: LoanDeedComponent;
  let fixture: ComponentFixture<LoanDeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
