import {HttpException, Injectable} from '@nestjs/common';
import axios from "axios";
import {ConfigService} from "@nestjs/config";
import https from 'https';
import GigaChat from "gigachat";

@Injectable()
export class GigachatService {
    private client: GigaChat;

    constructor(private readonly configService: ConfigService) {
        this.client = new GigaChat({
            credentials: this.configService.getOrThrow<string>('GIGACHAT_AUTH'),
            scope: 'GIGACHAT_API_PERS',
            model: 'GigaChat',
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
    }

    async sendMessage(messages: { role: string; content: string }[]) {
        const response = await this.client.chat({
            messages,
            temperature: 0.7,
        });

        const res = response?.choices?.[0]?.message?.content;
        if (!res) {
            throw new Error('Пустой ответ от Gigachat');
        }

        return res;
    }
}
