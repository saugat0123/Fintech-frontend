import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseInterestComponent } from './base-interest.component';

describe('BaseInterestComponent', () => {
  let component: BaseInterestComponent;
  let fixture: ComponentFixture<BaseInterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
