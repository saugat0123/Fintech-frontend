import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {IndemnityDeedComponent} from './indemnity-deed.component';

describe('IndemnityDeedComponent', () => {
  let component: IndemnityDeedComponent;
  let fixture: ComponentFixture<IndemnityDeedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IndemnityDeedComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndemnityDeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
