import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section18RequiredSecurityDocumentsComponent } from './section18-required-security-documents.component';

describe('Section18RequiredSecurityDocumentsComponent', () => {
  let component: Section18RequiredSecurityDocumentsComponent;
  let fixture: ComponentFixture<Section18RequiredSecurityDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section18RequiredSecurityDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section18RequiredSecurityDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
