import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredLegalDocumentSectionComponent } from './required-legal-document-section.component';

describe('RequiredLegalDocumentSectionComponent', () => {
  let component: RequiredLegalDocumentSectionComponent;
  let fixture: ComponentFixture<RequiredLegalDocumentSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequiredLegalDocumentSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredLegalDocumentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
