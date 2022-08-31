import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementaryAgreementProprietorshipComponent } from './supplementary-agreement-proprietorship.component';

describe('SupplementaryAgreementProprietorshipComponent', () => {
  let component: SupplementaryAgreementProprietorshipComponent;
  let fixture: ComponentFixture<SupplementaryAgreementProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplementaryAgreementProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplementaryAgreementProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
