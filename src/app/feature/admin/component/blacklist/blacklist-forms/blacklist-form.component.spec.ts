import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {BlacklistFormsComponent} from './blacklist-form.component';

describe('BlacklistFormsComponent', () => {
  let component: BlacklistFormsComponent;
  let fixture: ComponentFixture<BlacklistFormsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistFormsComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
