import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NepProposedAmountFormComponent } from './nep-proposed-amount-form.component';

describe('NepProposedAmountFormComponent', () => {
  let component: NepProposedAmountFormComponent;
  let fixture: ComponentFixture<NepProposedAmountFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NepProposedAmountFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepProposedAmountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
