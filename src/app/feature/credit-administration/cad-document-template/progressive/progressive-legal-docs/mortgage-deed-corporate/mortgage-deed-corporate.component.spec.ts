import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageDeedCorporateComponent } from './mortgage-deed-corporate.component';

describe('MortgageDeedCorporateComponent', () => {
  let component: MortgageDeedCorporateComponent;
  let fixture: ComponentFixture<MortgageDeedCorporateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgageDeedCorporateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageDeedCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
