import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KycInfoComponent} from './kyc-info.component';

describe('KycInfoComponent', () => {
  let component: KycInfoComponent;
  let fixture: ComponentFixture<KycInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KycInfoComponent]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
