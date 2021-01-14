import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDocumentComponent } from './additional-document.component';

describe('AdditionalDocumentComponent', () => {
  let component: AdditionalDocumentComponent;
  let fixture: ComponentFixture<AdditionalDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
