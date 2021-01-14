import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOfferLetterDocumentComponent } from './custom-offer-letter-document.component';

describe('CustomOfferLetterDocumentComponent', () => {
  let component: CustomOfferLetterDocumentComponent;
  let fixture: ComponentFixture<CustomOfferLetterDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomOfferLetterDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomOfferLetterDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
