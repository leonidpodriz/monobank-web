// Services for Monobank

import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

interface IAccount {
    id: string;
    balance: number;
    creditLimit: number;
    type: string;
    currencyCode: number;
    cashbackType: string;
}


interface IPersonalInfo {
    id: string;
    name: string;
    webHookUrl: string;
    accounts: IAccount[];
}

export class MonobankService {
    BASE_URL: string = "https://api.monobank.ua";
    token: string;

    constructor(token: string) {
        this.token = token;
    }

    prependBaseUrl(relativeUrl: string): string {
        return this.BASE_URL + relativeUrl
    }

    // Common http operations
    getTokenHeader(): Record<string, string> {
        return {
            "X-Token": this.token,
        }
    }

    getCommonHeaders(): Record<string, string> {
        return {
            ...this.getTokenHeader(),
        }
    }

    getAxiosConfig(): AxiosRequestConfig {
        return {
            headers: this.getCommonHeaders(),
        }
    }

    async get<T>(url: string): Promise<AxiosResponse<T>> {
        return axios.get(this.prependBaseUrl(url), this.getAxiosConfig());
    }

    // Monobank methods
    async getPersonalInfo() {
        const response = await this.get<IPersonalInfo>("/personal/client-info");
        return response.data;
    }

    async getStatements(account_id: string, from: Date, to: Date): Promise<IPersonalInfo> {
        const from_timestamp: number = + from;
        const to_timestamp: number = + to;

        if (to_timestamp - from_timestamp > 2682000) {
            throw Error(`Statements range is too big! Max range is ${2682000}!`);
        } else if (to_timestamp < from_timestamp) {
            throw Error(`Destination date should be bigger than start date!`);
        }

        const response = await this.get<IPersonalInfo>(
            `/personal/statement/{${account_id}/{${from_timestamp}/{${to_timestamp}`
        );
        return response.data;
    }
}