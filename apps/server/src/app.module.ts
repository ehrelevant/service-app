import { AuthModule } from '@thallesp/nestjs-better-auth';
import { Module } from '@nestjs/common';

import { auth } from './auth';

import { AddressesModule } from './addresses/addresses.module';
import { AgenciesModule } from './agencies/agencies.module';
import { BookingsModule } from './bookings/bookings.module';
import { DatabaseModule } from './database/database.module';
import { MessagesModule } from './messages/messages.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { ProvidersModule } from './providers/providers.module';
import { RequestsModule } from './requests/requests.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SeekersModule } from './seekers/seekers.module';
import { ServicesModule } from './services/services.module';
import { ServiceTypesModule } from './service-types/service-types.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule.forRoot({ auth }),
    UsersModule,
    ServicesModule,
    ServiceTypesModule,
    ProvidersModule,
    BookingsModule,
    ReviewsModule,
    AddressesModule,
    AgenciesModule,
    SeekersModule,
    RequestsModule,
    PortfoliosModule,
    MessagesModule,
  ],
})
export class AppModule {}
