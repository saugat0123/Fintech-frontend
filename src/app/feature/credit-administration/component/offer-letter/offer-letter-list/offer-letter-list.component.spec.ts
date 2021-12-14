import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferLetterListComponent } from './offer-letter-list.component';

describe('OfferLetterListComponent', () => {
  let component: OfferLetterListComponent;
  let fixture: ComponentFixture<OfferLetterListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
