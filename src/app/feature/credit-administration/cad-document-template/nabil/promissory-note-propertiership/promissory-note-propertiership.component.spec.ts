import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNotePropertiershipComponent } from './promissory-note-propertiership.component';

describe('PromissoryNotePropertiershipComponent', () => {
  let component: PromissoryNotePropertiershipComponent;
  let fixture: ComponentFixture<PromissoryNotePropertiershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNotePropertiershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNotePropertiershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
