import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityDocumentViewComponent } from './eligibility-document-view.component';

describe('EligibilityDocumentViewComponent', () => {
  let component: EligibilityDocumentViewComponent;
  let fixture: ComponentFixture<EligibilityDocumentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligibilityDocumentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
