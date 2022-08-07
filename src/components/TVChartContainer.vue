<template>
    <div class="TVChartContainer" ref="chartContainer" />
</template>

<script lang="ts">
import { widget } from '../../public/charting_library';
import { UDFCompatibleDatafeed } from "../../lib/datafeeds/udf/src/udf-compatible-datafeed";
import TVSaveLoadAdapter from "@/util/TVSaveLoadAdapter";
import API from "@/util/API";
import { useSwapEventStore } from "@/stores/SwapEventStore";
import { UnwrapRef } from "vue";
import { TokenSwapDto } from "../../env";

export default {
    name: 'TVChartContainer',
    props: {
        symbol: {
            default: 'DGC',
            type: String,
        },
        autosize: {
            default: true,
            type: Boolean,
        }
    },
    data() {
        return {
            tvWidget: null,
            tvSaveLoadAdapter: null,
            focusListener: null,

            get interval() {
                return localStorage.getItem("tradingview.chart.lastUsedTimeBasedResolution") || "1D";
            },
            set interval(value) {
                // no op
            }
        };
    },
    mounted() {
        let userId = window.localStorage["d3x.tv_user_id"] || "";
        if (!userId) {
            if (crypto && crypto.randomUUID) {
                userId = crypto.randomUUID();
            } else if (crypto) {
                userId = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                );
            } else {
                userId = '' + Date.now();
            }
            window.localStorage["d3x.tv_user_id"] = userId;
        }

        const container = this.$refs.chartContainer;
        const tvSaveLoadAdapter = new TVSaveLoadAdapter(this.symbol);
        const dataFeed = new UDFCompatibleDatafeed(API.baseUrl + "/api/charts", 30000);
        const widgetOptions = {
            symbol: this.symbol,
            // BEWARE: no trailing slash is expected in feed URL
            datafeed: dataFeed,
            // datafeed: new UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
            interval: this.interval,
            container: container,
            library_path: "/charting_library/",
            locale: 'en',
            disabled_features: ['header_compare', 'display_market_status', 'create_volume_indicator_by_default', 'header_symbol_search', 'symbol_search_hot_key'], // 'header_symbol_search', 'symbol_search_hot_key'
            enabled_features: ['use_localstorage_for_settings', 'study_templates'],
            // charts_storage_url: "https://saveload.tradingview.com",
            // charts_storage_api_version: "1.1",
            save_load_adapter: tvSaveLoadAdapter,
            load_last_chart: false,
            favorites: {
                intervals: ["15", "60", "240", "1D", "W"],
            },
            time_frames: [
                {text: "1y", resolution: "1D", description: "1 Year"},
                {text: "1m", resolution: "30", description: "1 Month"},
                {text: "1w", resolution: "5", description: "1 Week"},
                {text: "1000y", resolution: "1D", description: "All", title: "All"},
            ],
            client_id: "dogecubex.live",
            user_id: userId,
            header_widget_buttons_mode: 'adaptive',
            fullscreen: false,
            autosize: this.autosize,
            studies_overrides: {},
            overrides: {
                "scalesProperties.showStudyLastValue": false
            },
            theme: "Dark",
        };
        const tvWidget = new widget(widgetOptions);

        this.tvWidget = tvWidget;
        this.tvSaveLoadAdapter = tvSaveLoadAdapter;

        function initChart() {
            tvWidget.activeChart().createStudy(
                'Volume',
                true,
                false,
                {
                    showMA: false,
                    length: "",
                    smoothingLine: "",
                    smoothingLength: ""
                }
            );
            tvWidget.activeChart().createStudy(
                'Moving Average',
                true,
                false,
                {
                    length: 7
                },
                {'Plot.color': '#c21919'}
            );
            tvWidget.activeChart().createStudy(
                'Moving Average',
                true,
                false,
                {
                    length: 28
                },
                {'Plot.color': '#19c219'}
            );
        }

        function resetChart() {
            localStorage.removeItem("tradingview.chart.lastUsedTimeBasedResolution");
        }

        tvWidget.onChartReady(() => {
            initChart();
            tvWidget.activeChart().onSymbolChanged().subscribe(null, () => {
                const tvSymbol = tvWidget.activeChart().symbol();
                const parts = tvSymbol.split(":");
                const symbol = parts[parts.length - 1];
                tvSaveLoadAdapter.currentSymbol = symbol;
            });
            // tvWidget.headerReady().then(() => {
            //     const button = tvWidget.createButton();
            //     button.setAttribute('title', 'Reset chart indicators to default state');
            //     button.classList.add('apply-common-tooltip');
            //     button.addEventListener('click', () => tvWidget.showConfirmDialog({
            //         title: 'Chart Reset',
            //         body: 'The current chart will reset and reload with default indicators. Saved charts will not be removed.',
            //         callback: (confirmed) => {
            //             if (confirmed) {
            //                 resetChart();
            //                 window.location.reload();
            //             }
            //         },
            //     }));
            //     button.innerHTML = 'Reset';
            // });
        });

        this.SwapEventStore.subscribe(this.onNewSwap);

        this.focusListener = () => {
            (<any> dataFeed)._dataPulseProvider._updateData();
        }
        window.addEventListener('focus', this.focusListener);
    },
    unmounted() {
        if (this.tvWidget !== null) {
            this.tvWidget.remove();
            this.tvWidget = null;
        }
        if (this.focusListener) {
            window.removeEventListener('focus', this.focusListener);
            this.focusListener = null;
        }
    },
    methods: {
        onNewSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            const swap: TokenSwapDto = state.lastSwap;
            const symbol = swap.tokenTo !== "XRD" ? swap.tokenTo : swap.tokenFrom;
            if (symbol === this.symbol) {
                this.focusListener();
            }
        },
    },
    computed: {
        SwapEventStore() {
            return useSwapEventStore();
        },
    },
    watch: {
        symbol(newVal) {
            this.tvSaveLoadAdapter.currentSymbol = newVal;
            this.tvWidget.setSymbol(newVal, this.interval);
        },
    }
}
</script>

