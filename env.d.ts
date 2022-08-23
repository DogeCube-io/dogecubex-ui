/// <reference types="vite/client" />


import type { RouteRecordRaw } from "vue-router";

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

// Models
declare type SwapModel = {
    from?: string,
    to?: string,
    amount?: string,
    xrd?: string,
}

declare type TokenInfoModel = {
    symbol?: string,
}



/* DTO types */
declare type AmmConfigDto = {
    minOrderSize: number;
    maxOrderSize: number;
    stakerMaxOrderSize: number;
    swapTransferFeeXrd: number;
    swapRefundFeeXrd: number;
    exchangeFee: number;
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

declare type StatusStringDto = {
    status: string;
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

declare type SummaryStatsDto = {
    count: number;
    volume: string;
}

declare type SummaryStatsV2Dto = {
    count: number;
    volume: number;
}

declare type AnalyticsSummaryDto = {
    day: SummaryStatsDto;
    week: SummaryStatsDto;
}

declare type AnalyticsSummaryV2Dto = {
    day: SummaryStatsV2Dto;
    week: SummaryStatsV2Dto;
    total: SummaryStatsV2Dto;
    liquidity: number;
}

declare type TokenAnalyticsDto = {
    token: TokenInfoDto;
    price: number;
    priceChange24h: number;
    priceChange7d: number;
    volume24h: number;
    volume7d: number;
    liquidityA: number;
    liquidityB: number;
    valuation: number;
    currency: string;
}

declare type TokenSwapDto = {
    user: string;

    tokenFrom: string;
    tokenTo: string;
    txIn: string;
    txOut: string;
    amountFrom: number;
    amountTo: number;

    dateAdded: number;
    timeAgo: string;
}

declare type TokenDetailsDto = {
    symbol: string;
    description: string;
    poolAccount: string;
    tokenInfoUrl: string;
    totalSupply: number;

    analytics: TokenAnalyticsDto;
}

declare type AccountInfoDto = {
    maxOrderSize: number;
    balances: Record<string, string> | null;
}

declare type AccountInfoDtoExt = AccountInfoDto & {
    account: string;
}
