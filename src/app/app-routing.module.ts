import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { FormTranslatorComponent } from './form-translator/form-translator.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: ':screen', component: FormTranslatorComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
