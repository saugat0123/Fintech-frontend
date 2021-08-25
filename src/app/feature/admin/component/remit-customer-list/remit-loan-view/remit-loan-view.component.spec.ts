import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitLoanViewComponent } from './remit-loan-view.component';

describe('RemitLoanViewComponent', () => {
  let component: RemitLoanViewComponent;
  let fixture: ComponentFixture<RemitLoanViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitLoanViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitLoanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
