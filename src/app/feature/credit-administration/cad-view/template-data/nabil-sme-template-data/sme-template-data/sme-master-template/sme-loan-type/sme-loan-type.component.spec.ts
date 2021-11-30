import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeLoanTypeComponent } from './sme-loan-type.component';

describe('SmeLoanTypeComponent', () => {
  let component: SmeLoanTypeComponent;
  let fixture: ComponentFixture<SmeLoanTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeLoanTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeLoanTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
