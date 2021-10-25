import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RoutingModule } from './routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {AuthenticationInterceptor } from '../interceptors/AuthenticationInterceptor';

import { LayoutComponent } from '../components/layout/layout.component';
import { HeaderComponent } from '../components/header/header.component';
import { MenuComponent } from '../components/menu/menu.component';
import { MainComponent } from '../components/main/main.component';
import { FooterComponent } from '../components/footer/footer.component';
import { AboutComponent } from '../components/about/about.component';
import { LoginComponent } from '../components/login/login.component';
import { AccountComponent } from '../components/account/account.component';
import { InvestmentsComponent } from '../components/investments/investments.component';
import { CoinvaluesComponent } from '../components/coinvalues/coinvalues.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    MenuComponent,
    MainComponent,
    FooterComponent,
    AboutComponent,
    LoginComponent,
    AccountComponent,
    InvestmentsComponent,
    CoinvaluesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    RoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [ {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true}],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
