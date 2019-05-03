import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoanUiComponent} from './loan-ui.component';

describe('LoanUiComponent', () => {
  let component: LoanUiComponent;
  let fixture: ComponentFixture<LoanUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoanUiComponent]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
