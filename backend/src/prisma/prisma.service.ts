import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    //устанавливаем коннект с бд при запуске приложения
    async onModuleInit() {
        await this.$connect();
    }

    //дисконнект при остановке приложения, т е при уничтожении модуля
    async onModuleDestroy() {
        await this.$disconnect();
    }
}