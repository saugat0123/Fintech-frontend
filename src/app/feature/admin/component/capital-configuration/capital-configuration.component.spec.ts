import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalConfigurationComponent } from './capital-configuration.component';

describe('CapitalConfigurationComponent', () => {
  let component: CapitalConfigurationComponent;
  let fixture: ComponentFixture<CapitalConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapitalConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
