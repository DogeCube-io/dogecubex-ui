/// <reference types="vite/client" />


import { RouteRecordRaw } from "vue-router";

declare type MetaTag = {
    property: string,
    content: string,
};
declare type RouteRecordWithTitle = {
    meta: {
        title: string,
        metaTags: Array<MetaTag>
    }
} & RouteRecordRaw;


/* DTO types */
declare type AmmConfigDto = {
    minOrderSize: string;
    maxOrderSize: string;
    stakerMaxOrderSize: string;
    swapTransferFeeXrd: string;
    swapRefundFeeXrd: string;
    exchangeFee: string;
}

declare type TokenDto = {
    rri: string;
    symbol: string;
    name: string;
    description: string;
    price: string;
}

declare type StakerResponseDto = {
    stakers: StakerDto[];
    stakingLimits: { [key: string]: string }[];
    defaultLimit: string;
}

declare type StakerDto = {
    address: string;
    stake: string;
    tradeLimit: string;
}

declare type TokenInfoDto = {
    symbol: string;
    name: string;
    rri: string;
    iconUrl: string;
}

declare type PoolInfoDto = {
    token: TokenInfoDto;
    account: string;
    heroImageUrl: string;
}

declare type StatusDto = {
    status: string;
    pool: PoolDto;
}

declare type PoolDto = {
    tokenA: string;
    tokenB: string;
    amountA: string;
    amountB: string;
}

declare type QuoteDto = {
    sentAmount: string;
    receivedAmount: string;
    minAmount: string;
    price: string;
    priceImpact: string;
    resultingPrice: string;

    error?: string;
}
