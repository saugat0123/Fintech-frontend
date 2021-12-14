import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CadOfferLetterConfigurationComponent } from './cad-offer-letter-configuration.component';

describe('CadOfferLetterConfigurationComponent', () => {
  let component: CadOfferLetterConfigurationComponent;
  let fixture: ComponentFixture<CadOfferLetterConfigurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CadOfferLetterConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadOfferLetterConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
