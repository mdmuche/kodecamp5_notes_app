import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async clearDatabase(): Promise<any> {
    if (process.env.NODE_ENV === 'production') return null;
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');
    return Promise.all(models.map((model) => this[model].deleteMany()));
  }
}
