import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarantorInformationTaggingComponent } from './guarantor-information-tagging.component';

describe('GuarantorInformationTaggingComponent', () => {
  let component: GuarantorInformationTaggingComponent;
  let fixture: ComponentFixture<GuarantorInformationTaggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuarantorInformationTaggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarantorInformationTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
