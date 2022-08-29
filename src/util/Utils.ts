import type { TokenInfoDto } from "../../env";

export default class Utils {
    static formatLong = new Intl.NumberFormat('en-US', {maximumSignificantDigits: 12});
    static formatShort = new Intl.NumberFormat('en-US', {maximumSignificantDigits: 6});
    static formatXs = new Intl.NumberFormat('en-US', {maximumSignificantDigits: 3});
    static XRD_TOKEN: TokenInfoDto = {
        symbol: "XRD",
        name: "Radix",
        rri: "xrd_rr1qy5wfsfh",
        iconUrl: "https://assets.radixdlt.com/icons/icon-xrd-32x32.png",
    };

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
        const prefixLength = w >= 440 ? 13 : (w >= 405 ? 11 : (w > 360 ? 4 : 2));
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

    static displayCurrencyXs(amount: string | number): string {
        return this.formatXs.format(Number(amount));
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

    static displayCurrencySmart(amount: string | number) {
        const amt = Number(amount);
        return amt && amt < 100 ? Utils.displayCurrencyXs(amt) : Utils.displayCurrency0(amount);
    }

    static str(amount: number): string {
        return String(amount);
    }

    static strWithSign(amount: number): string {
        return amount > 0 ? "+" + this.str(amount) : this.str(amount);
    }

    static toAttos(num: string): string {
        const parts = num.split(".");
        const decimals = parts.length > 1 ? (parts[1] + "0".repeat(18 - parts[1].length)) : "0".repeat(18);

        return parts[0] + decimals;
    }

    static compare(a: string, b: string): number {
        const partsA = a.split(".");
        const partsB = b.split(".");
        const numA0 = Number(partsA[0]);
        const numB0 = Number(partsB[0]);
        if (numA0 > numB0) {
            return 1;
        } else if (numB0 > numA0) {
            return -1;
        }

        const numA1 = Number(partsA.length > 1 ? partsA[1] : 0);
        const numB1 = Number(partsB.length > 1 ? partsB[1] : 0);
        if (numA1 > numB1) {
            return 1;
        } else if (numB1 > numA1) {
            return -1;
        } else {
            return 0;
        }
    }

}
