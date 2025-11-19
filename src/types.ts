declare const Buffer: any;

export class Asset {

    public policyId: string;
    public nameHex: string;
    public decimals: number;
    public verified: boolean;
    public ticker?: string;
    public isVerified?: boolean;

    constructor(policyId: string, nameHex: string, decimals: number = 0, verified: boolean = false, ticker: string = "") {
        this.policyId = policyId;
        this.nameHex = nameHex;
        this.decimals = decimals;
        this.verified = this.isVerified = verified;
        this.ticker = ticker;
    }

    static fromIdentifier(id: string, decimals: number = 0): Asset {
        id = id.replace('.', '');

        return new Asset(
            id.slice(0, 56),
            id.slice(56),
            decimals
        );
    }

    identifier(dilimeter: '' | '.' = ''): string {
        return this.policyId + dilimeter + this.nameHex;
    }

    get assetName(): string {
        // Exception case
        if(this.policyId === '8fef2d34078659493ce161a6c7fba4b56afefa8535296a5743f69587' && this.nameHex === '41414441') {
            return 'LENFI';
        }
        return Buffer.from(this.nameHex, 'hex').toString().replace(/[^ -~]/g, '');
    }

}

export type Token = Asset | 'lovelace';

export type Signal = {
    timestamp: string;
    price: number;
    lastPrice: number;
    deltaPercent: number;
};