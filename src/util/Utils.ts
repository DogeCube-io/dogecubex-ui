export default {
    shortRri: (rri: string): string => {
        if (rri.length <= 15) {
            return rri;
        }
        const symbol = rri.split('_')[0];
        return symbol + "..." + rri.substring(rri.length - 12 + symbol.length);
    },
    shortAddress: (addr: string): string => {
        if (!addr) {
            return "";
        }
        return addr.substring(0, 13) + "..." + addr.substring(addr.length - 8);
    },
    displayCurrency: (amount: string): string => {
        return amount;
    }
}
