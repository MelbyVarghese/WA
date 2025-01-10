import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from './error/error.component';
import { XsrfInterceptor } from './@core/interceptors/xsrf.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Req_EncryptInterceptor } from './@core/interceptors/req_encrypt.interceptor';
import { Res_DecryptInterceptor } from './@core/interceptors/res_decrypt.interceptor';

@NgModule({
  declarations: [AppComponent, ErrorComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastModule,
  ],
  providers: [
    CookieService,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: XsrfInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Req_EncryptInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Res_DecryptInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
