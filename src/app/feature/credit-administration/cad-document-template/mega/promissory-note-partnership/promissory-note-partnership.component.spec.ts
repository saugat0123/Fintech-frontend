import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNotePartnershipComponent } from './promissory-note-partnership.component';

describe('PromissoryNotePartnershipComponent', () => {
  let component: PromissoryNotePartnershipComponent;
  let fixture: ComponentFixture<PromissoryNotePartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNotePartnershipComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNotePartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
