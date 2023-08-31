import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConeViewComponent } from './components/cone-view/cone-view.component';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ConeViewComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
