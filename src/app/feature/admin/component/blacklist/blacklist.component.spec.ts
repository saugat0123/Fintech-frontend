import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlacklistComponent } from './blacklist.component';

describe('BlacklistComponent', () => {
  let component: BlacklistComponent;
  let fixture: ComponentFixture<BlacklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
