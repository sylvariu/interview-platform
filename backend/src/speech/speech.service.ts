import {HttpException, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import https from "https";

@Injectable()
export class SpeechService {
    private accessToken: string | null = null;
    private tokenExpiresAt: number | null = null;

    constructor(private readonly configService: ConfigService) {}

    private async getAccessToken(){
        if (this.accessToken &&
            this.tokenExpiresAt &&
            Date.now() < this.tokenExpiresAt) {
            return this.accessToken;
        }

        try {

            const auth = this.configService.getOrThrow<string>('SALUTE_SPEECH_AUTH');
            const response = await axios.post(
                'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
                'scope=SALUTE_SPEECH_PERS',
                {
                    headers: {
                        Authorization: `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        RqUID: uuidv4(),
                    },
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false,
                    }),
                },
            );

            this.accessToken = response.data.access_token;
            this.tokenExpiresAt = Date.now() + response.data.expires_at * 1000;

            return this.accessToken;
        } catch (e) {
            console.error(e.response?.data || e.message);
            throw new HttpException('Ошибка получения access token SaluteSpeech', 500);
        }
    }

    async speechToText(audioBuffer: Buffer) {
        const token = await this.getAccessToken();

        try {
            const response = await axios.post(
                'https://smartspeech.sber.ru/rest/v1/speech:recognize',
                audioBuffer,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'audio/x-pcm;bit=16;rate=16000',
                    },
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false,
                    }),
                },
            );

            console.log('SALUTE SpeechToText RESPONSE: ', JSON.stringify(response.data, null, 2));

            let text = '';

            if (Array.isArray(response.data?.result)) {
                text = response.data.result[0];
            } else if (response.data?.result?.[0]?.alternatives) {
                text = response.data.result[0].alternatives[0]?.text;
            }
            //if (!text) { throw new Error('Пустой результат распознавания'); }
            if (!text || text.trim().length < 2) {
                return '';
            }
            return text;

        } catch (e) {
            if (e.response) {
                console.error('STT API Error:', e.response.status, e.response.data);
            } else {
                console.error('STT Network/Code Error:', e.message);
            }
            throw new HttpException('Ошибка распознавания речи', 500);
        }
    }

    async textToSpeech(text: string) {
        const token = await this.getAccessToken();

        try {
            const response = await axios.post(
                'https://smartspeech.sber.ru/rest/v1/text:synthesize',
                text,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/text',
                    },
                    params: {
                        format: 'opus',
                        voice: 'Nec_24000',
                    },
                    responseType: 'arraybuffer',
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false,
                    }),
                },
            );

            return response.data;
        } catch (e) {
            if (e.response) {
                console.error('TTS API Error:', e.response.status, e.response.data);
            } else {
                console.error('TTS Network/Code Error:', e.message);
            }
            throw new HttpException('Ошибка синтеза речи', 500);
        }
    }
}
