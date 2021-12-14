import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromissoryNoteIcfcComponent } from './promissory-note-icfc.component';

describe('PromissoryNoteIcfcComponent', () => {
  let component: PromissoryNoteIcfcComponent;
  let fixture: ComponentFixture<PromissoryNoteIcfcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNoteIcfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteIcfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
