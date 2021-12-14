import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IcfcOfferLetterComponent } from './icfc-offer-letter.component';

describe('IcfcOfferLetterComponent', () => {
  let component: IcfcOfferLetterComponent;
  let fixture: ComponentFixture<IcfcOfferLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IcfcOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcfcOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
