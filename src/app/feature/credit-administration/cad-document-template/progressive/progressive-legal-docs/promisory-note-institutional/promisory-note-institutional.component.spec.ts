import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromisoryNoteInstitutionalComponent } from './promisory-note-institutional.component';

describe('PromisoryNoteInstitutionalComponent', () => {
  let component: PromisoryNoteInstitutionalComponent;
  let fixture: ComponentFixture<PromisoryNoteInstitutionalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromisoryNoteInstitutionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromisoryNoteInstitutionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
