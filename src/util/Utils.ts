export default class Utils {
    static formatLong = new Intl.NumberFormat('en-US', {maximumSignificantDigits: 12});
    static formatShort = new Intl.NumberFormat('en-US', {maximumSignificantDigits: 6});

    static shortRri(rri: string): string {
        if (rri.length <= 15) {
            return rri;
        }
        const symbol = rri.split('_')[0];
        return symbol + "..." + rri.substring(rri.length - 12 + symbol.length);
    }

    static shortAddress(addr: string): string {
        if (!addr) {
            return "";
        }
        const w = window.innerWidth;
        const prefixLength =  w >= 440 ? 13 : (w >= 405 ? 11 : (w > 360 ? 4 : 2));
        return addr.substring(0, prefixLength) + "..." + addr.substring(addr.length - 8);
    }

    static addressHuge(addr: string): string {
        if (!addr) {
            return "";
        }
        return addr.substring(0, 13) + "..." + addr.substring(addr.length - 10);
    }

    static addressMedium(addr: string): string {
        if (!addr) {
            return "";
        }
        return addr.substring(0, 4) + "..." + addr.substring(addr.length - 8);
    }

    static addressTiny(addr: string): string {
        if (!addr) {
            return "";
        }
        return addr.substring(0, 2) + ".." + addr.substring(addr.length - 6);
    }


    static displayCurrencyShort(amount: string | number): string {
        return this.formatShort.format(Number(amount));
    }

    static displayCurrencyShort0(amount: string | number): string {
        return this.formatShort.format(Math.round(Number(amount))).split(".")[0];
    }

    static displayCurrency(amount: string | number): string {
        return this.formatLong.format(Number(amount));
    }

    static displayCurrency0(amount: string | number): string {
        return this.formatLong.format(Math.round(Number(amount))).split(".")[0];
    }

    static str(amount: number): string {
        return String(amount);
    }

    static strWithSign(amount: number): string {
        return amount > 0 ? "+" + this.str(amount) : this.str(amount);
    }

}
