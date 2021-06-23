import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditMemoTypeDeleteComponent } from './credit-memo-type-delete.component';

describe('CreditMemoTypeDeleteComponent', () => {
  let component: CreditMemoTypeDeleteComponent;
  let fixture: ComponentFixture<CreditMemoTypeDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditMemoTypeDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditMemoTypeDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
