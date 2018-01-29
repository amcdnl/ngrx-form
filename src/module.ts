import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { FormDirective } from './directive';

@NgModule({
  imports: [ReactiveFormsModule, StoreModule],
  declarations: [FormDirective],
  exports: [FormDirective]
})
export class NgrxFormModule {}
