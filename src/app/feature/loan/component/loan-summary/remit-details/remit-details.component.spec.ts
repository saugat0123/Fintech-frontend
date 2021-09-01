import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitDetailsComponent } from './remit-details.component';

describe('RemitDetailsComponent', () => {
  let component: RemitDetailsComponent;
  let fixture: ComponentFixture<RemitDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
