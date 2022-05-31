import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailCombinedRequiredDocumentComponent } from './retail-combined-required-document.component';

describe('RetailCombinedRequiredDocumentComponent', () => {
  let component: RetailCombinedRequiredDocumentComponent;
  let fixture: ComponentFixture<RetailCombinedRequiredDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailCombinedRequiredDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailCombinedRequiredDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
