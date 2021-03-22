import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadFileSetupComponent } from './cad-file-setup.component';

describe('CadFileSetupComponent', () => {
  let component: CadFileSetupComponent;
  let fixture: ComponentFixture<CadFileSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadFileSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadFileSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
