import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PromissoryNoteGuarantorComponent} from './promissory-note-guarantor.component';

describe('PromissoryNoteGuarantorComponent', () => {
  let component: PromissoryNoteGuarantorComponent;
  let fixture: ComponentFixture<PromissoryNoteGuarantorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PromissoryNoteGuarantorComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteGuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
