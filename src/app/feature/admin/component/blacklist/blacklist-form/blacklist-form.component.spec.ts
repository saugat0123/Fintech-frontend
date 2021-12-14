import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlacklistFormComponent } from './blacklist-form.component';

describe('BlacklistFormComponent', () => {
  let component: BlacklistFormComponent;
  let fixture: ComponentFixture<BlacklistFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistFormComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
