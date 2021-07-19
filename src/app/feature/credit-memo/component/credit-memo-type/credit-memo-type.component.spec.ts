import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditMemoTypeComponent } from './credit-memo-type.component';

describe('CreditMemoTypeComponent', () => {
  let component: CreditMemoTypeComponent;
  let fixture: ComponentFixture<CreditMemoTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditMemoTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditMemoTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
