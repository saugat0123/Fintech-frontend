import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PromissoryNoteComponent} from './promissory-note.component';

describe('PromissoryNoteComponent', () => {
  let component: PromissoryNoteComponent;
  let fixture: ComponentFixture<PromissoryNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PromissoryNoteComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
