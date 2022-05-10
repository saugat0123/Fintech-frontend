import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalConfigurationFormComponent } from './capital-configuration-form.component';

describe('CapitalConfigurationFormComponent', () => {
  let component: CapitalConfigurationFormComponent;
  let fixture: ComponentFixture<CapitalConfigurationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapitalConfigurationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalConfigurationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
