import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpNoteGuarantorComponent } from './dp-note-guarantor.component';

describe('DpNoteGuarantorComponent', () => {
  let component: DpNoteGuarantorComponent;
  let fixture: ComponentFixture<DpNoteGuarantorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpNoteGuarantorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpNoteGuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
