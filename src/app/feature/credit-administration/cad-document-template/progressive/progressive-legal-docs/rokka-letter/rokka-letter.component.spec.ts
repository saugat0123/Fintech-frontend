import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RokkaLetterComponent } from './rokka-letter.component';

describe('RokkaLetterComponent', () => {
  let component: RokkaLetterComponent;
  let fixture: ComponentFixture<RokkaLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RokkaLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RokkaLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
