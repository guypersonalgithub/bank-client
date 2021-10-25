import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from '../components/main/main.component';
import { LoginComponent } from '../components/login/login.component';
import { AboutComponent } from '../components/about/about.component';
import { AccountComponent } from '../components/account/account.component';
import { InvestmentsComponent } from '../components/investments/investments.component';
import { CoinvaluesComponent } from '../components/coinvalues/coinvalues.component';


const routes: Routes = [

      { path: "", component: MainComponent },
      { path: "login", component: LoginComponent },
      { path: "about", component: AboutComponent },
      { path: "account", component: AccountComponent },
      { path: "investments", component: InvestmentsComponent },
      { path: "coinrates", component: CoinvaluesComponent },
      { path: "", redirectTo: "", pathMatch: "full" },

];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ]
})

export class RoutingModule {


}