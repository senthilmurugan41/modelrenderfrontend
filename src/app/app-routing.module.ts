import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelviewerComponent } from './modelviewer/modelviewer.component';
import { SearchbarComponent } from './searchbar/searchbar.component';

const routes: Routes = [
  {path:'searchbar',component:SearchbarComponent},
  {path:'modelViewer',component:ModelviewerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
