import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormsComponent } from './forms.component';
import { FormLayoutsComponent } from './form-layouts/form-layouts.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { MovieListComponent } from './movie-list/movie-list.component';

const routes: Routes = [
  {
    path: '',
    component: FormsComponent,
    children: [
      {
        path: 'layouts',
        component: FormLayoutsComponent,
      },
      {
        path: 'layouts',
        component: FormLayoutsComponent,
      },
      {
        path: 'datepicker',
        component: DatepickerComponent,
      },
      {
        path: 'add-movie',
        component: AddMovieComponent,
      },
      {
        path: 'movie-list',
        component: MovieListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class FormsRoutingModule {
}

