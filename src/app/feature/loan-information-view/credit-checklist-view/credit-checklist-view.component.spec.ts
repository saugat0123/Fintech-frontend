import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreditChecklistViewComponent } from './credit-checklist-view.component';

describe('CreditChecklistViewComponent', () => {
  let component: CreditChecklistViewComponent;
  let fixture: ComponentFixture<CreditChecklistViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditChecklistViewComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditChecklistViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
