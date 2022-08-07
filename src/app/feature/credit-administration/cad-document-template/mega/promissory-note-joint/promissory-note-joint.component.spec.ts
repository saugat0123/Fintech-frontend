import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteJointComponent } from './promissory-note-joint.component';

describe('PromissoryNoteJointComponent', () => {
  let component: PromissoryNoteJointComponent;
  let fixture: ComponentFixture<PromissoryNoteJointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNoteJointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteJointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
