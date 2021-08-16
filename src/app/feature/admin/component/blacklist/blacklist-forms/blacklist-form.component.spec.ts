import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {BlacklistFormComponents} from './blacklist-form.component';

describe('BlacklistFormComponents', () => {
  let component: BlacklistFormComponents;
  let fixture: ComponentFixture<BlacklistFormComponents>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistFormComponents ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistFormComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
