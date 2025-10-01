import { Routes } from '@angular/router';
import { HighlightsListComponent } from '../ide-heighlight/ide-list.component';

export const ideHighlightsRoutes: Routes = [
  {
    path: '',
    component: HighlightsListComponent,
    title: 'IDE Highlights - DCoE'
  }
];