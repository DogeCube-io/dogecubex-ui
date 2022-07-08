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
    stakingLimits: {[key:string]: string }[];
    defaultLimit: string;
}

declare type StakerDto = {
    address: string;
    stake: string;
    tradeLimit: string;
}
