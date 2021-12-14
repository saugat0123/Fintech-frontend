import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAdditionalDocumentComponent } from './add-additional-document.component';

describe('AddAdditionalDocumentComponent', () => {
  let component: AddAdditionalDocumentComponent;
  let fixture: ComponentFixture<AddAdditionalDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAdditionalDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdditionalDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
