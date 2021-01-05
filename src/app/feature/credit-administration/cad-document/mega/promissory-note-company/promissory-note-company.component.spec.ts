import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteCompanyComponent } from './promissory-note-company.component';

describe('PromissoryNoteCompanyComponent', () => {
  let component: PromissoryNoteCompanyComponent;
  let fixture: ComponentFixture<PromissoryNoteCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNoteCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
