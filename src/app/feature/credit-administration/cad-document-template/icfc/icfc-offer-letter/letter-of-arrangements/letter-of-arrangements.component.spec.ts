import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LetterOfArrangementsComponent } from './letter-of-arrangements.component';

describe('LetterOfArrangementsComponent', () => {
  let component: LetterOfArrangementsComponent;
  let fixture: ComponentFixture<LetterOfArrangementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfArrangementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfArrangementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
