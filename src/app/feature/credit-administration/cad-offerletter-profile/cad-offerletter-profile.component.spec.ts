import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadOfferletterProfileComponent } from './cad-offerletter-profile.component';

describe('CadOfferletterProfileComponent', () => {
  let component: CadOfferletterProfileComponent;
  let fixture: ComponentFixture<CadOfferletterProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadOfferletterProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadOfferletterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
