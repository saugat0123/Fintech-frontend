import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassASanctionLetterComponent } from './class-a-sanction-letter.component';

describe('ClassASanctionLetterComponent', () => {
  let component: ClassASanctionLetterComponent;
  let fixture: ComponentFixture<ClassASanctionLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassASanctionLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassASanctionLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
