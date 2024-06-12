import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelviewerComponent } from './modelviewer.component';

describe('ModelviewerComponent', () => {
  let component: ModelviewerComponent;
  let fixture: ComponentFixture<ModelviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelviewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
