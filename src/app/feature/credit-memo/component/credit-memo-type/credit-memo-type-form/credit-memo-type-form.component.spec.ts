import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditMemoTypeFormComponent } from './credit-memo-type-form.component';

describe('CreditMemoTypeFormComponent', () => {
  let component: CreditMemoTypeFormComponent;
  let fixture: ComponentFixture<CreditMemoTypeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditMemoTypeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditMemoTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
