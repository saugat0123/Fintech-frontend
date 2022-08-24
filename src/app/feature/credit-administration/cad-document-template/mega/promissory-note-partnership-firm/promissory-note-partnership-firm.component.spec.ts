import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNotePartnershipFirmComponent } from './promissory-note-partnership-firm.component';

describe('PromissoryNoteJointComponent', () => {
  let component: PromissoryNotePartnershipFirmComponent;
  let fixture: ComponentFixture<PromissoryNotePartnershipFirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNotePartnershipFirmComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNotePartnershipFirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
