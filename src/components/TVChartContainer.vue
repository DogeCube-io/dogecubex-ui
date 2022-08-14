<template>
    <div class="TVChartContainer" ref="chartContainer" />
</template>

<script lang="ts">
import type {
    ChartingLibraryWidgetOptions, IChartingLibraryWidget, ResolutionString
} from '../../public/charting_library';
import { widget } from '../../public/charting_library';
import { UDFCompatibleDatafeed } from "../../lib/datafeeds/udf/src/udf-compatible-datafeed";
import TVSaveLoadAdapter from "@/util/TVSaveLoadAdapter";
import API from "@/util/API";
import { useSwapEventStore } from "@/stores/SwapEventStore";
import type { UnwrapRef } from "vue";
import { defineComponent } from "vue";
import type { TokenSwapDto } from "../../env";
import { noop } from "@vueuse/core";
import { useSettingsStore } from "@/stores/SettingsStore";

export default defineComponent({
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
            tvWidget: null as null | IChartingLibraryWidget,
            tvSaveLoadAdapter: null as null | TVSaveLoadAdapter,
            tvDataFeed: null as null | UDFCompatibleDatafeed,
            tvCurrencyBtn: null as null | HTMLElement,
            focusListener: null as null | (() => void),

            compact: false,
            currency: "XRD",

            get interval() {
                return localStorage.getItem("tradingview.chart.lastUsedTimeBasedResolution") || "1D";
            },
            set interval(value) {
                // no op
            }
        };
    },
    mounted() {
        this.currency = this.SettingsStore.chartCurrency || "XRD";
        this.initChart(this.SettingsStore.compactChart === "1");

        this.SwapEventStore.subscribe(this.onNewSwap);
        this.SettingsStore.subscribeChartChange(this.onChartSettingsChange);

        this.focusListener = () => {
            (this.tvDataFeed as any)._dataPulseProvider._updateData();
        };
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
        this.tvDataFeed = null;
        this.tvCurrencyBtn = null;
    },
    methods: {
        initChart(compact: boolean) {
            let userId = window.localStorage["d3x.tv_user_id"] || "";
            if (!userId) {
                if (crypto && crypto.randomUUID) {
                    userId = crypto.randomUUID();
                } else if (crypto) {
                    userId = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
                        (Number(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(c) / 4).toString(16)
                    );
                } else {
                    userId = '' + Date.now();
                }
                window.localStorage["d3x.tv_user_id"] = userId;
            }

            const container = this.$refs.chartContainer;
            const tvSymbol = this.symbol !== "XRD" ? this.symbol + ":" + this.currency : "XRD:USD";
            const tvSaveLoadAdapter = new TVSaveLoadAdapter(tvSymbol);
            const dataFeed = new UDFCompatibleDatafeed(API.baseUrl + "/api/charts", 30000);
            const widgetOptions = {
                symbol: tvSymbol,
                // BEWARE: no trailing slash is expected in feed URL
                datafeed: dataFeed,
                interval: this.interval as ResolutionString,
                container: container,
                library_path: "/charting_library/",
                locale: 'en',
                disabled_features: ['header_compare', 'display_market_status', 'create_volume_indicator_by_default', 'header_symbol_search', 'symbol_search_hot_key'], // 'header_symbol_search', 'symbol_search_hot_key'
                enabled_features: ['use_localstorage_for_settings', 'study_templates'],
                save_load_adapter: tvSaveLoadAdapter,
                load_last_chart: false,
                favorites: {
                    intervals: [
                        "15" as ResolutionString,
                        "60" as ResolutionString,
                        "240" as ResolutionString,
                        "1D" as ResolutionString,
                        "W" as ResolutionString,
                    ],
                    chartTypes: []
                },
                time_frames: [
                    {text: "1y", resolution: "1D" as ResolutionString, description: "1 Year"},
                    {text: "1m", resolution: "30" as ResolutionString, description: "1 Month"},
                    {text: "1w", resolution: "5" as ResolutionString, description: "1 Week"},
                    {text: "1000y", resolution: "1D" as ResolutionString, description: "All", title: "All"},
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
                custom_css_url: "/css/tv-overrides.css?_v=1",
                theme: "Dark",
            } as ChartingLibraryWidgetOptions;

            if (compact) {
                // widgetOptions.preset = "mobile";
                if (!widgetOptions.disabled_features) {
                    widgetOptions.disabled_features = [];
                }
                widgetOptions.disabled_features.push("left_toolbar");
                widgetOptions.disabled_features.push("control_bar");
                widgetOptions.disabled_features.push("timeframes_toolbar");
                widgetOptions.disabled_features.push("border_around_the_chart");
                widgetOptions.disabled_features.push("header_chart_type");
                widgetOptions.disabled_features.push("header_indicators");
                widgetOptions.disabled_features.push("header_undo_redo");
                widgetOptions.disabled_features.push("header_saveload");
                widgetOptions.disabled_features.push("header_screenshot");

                if (widgetOptions.enabled_features) {
                    widgetOptions.enabled_features = widgetOptions.enabled_features.filter(f => f !== "study_templates");
                }

                if (widgetOptions.favorites) {
                    widgetOptions.favorites.intervals = [
                        "60" as ResolutionString,
                        "1D" as ResolutionString,
                        "W" as ResolutionString,
                    ];
                }
            }

            const tvWidget = new widget(widgetOptions);

            this.compact = compact;
            this.tvWidget = tvWidget;
            this.tvSaveLoadAdapter = tvSaveLoadAdapter;
            this.tvDataFeed = dataFeed;

            function initChartIndicators() {
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
                if (compact) {
                    tvWidget.applyOverrides({
                        'paneProperties.legendProperties.showLegend': false,
                    });
                }
            }

            function resetChart() {
                localStorage.removeItem("tradingview.chart.lastUsedTimeBasedResolution");
            }

            tvWidget.onChartReady(() => {
                initChartIndicators();
                tvWidget.activeChart().onSymbolChanged().subscribe(null, () => {
                    tvSaveLoadAdapter.currentSymbol = tvWidget.activeChart().symbol();
                });
                tvWidget.headerReady().then(() => {
                    const button = tvWidget.createButton();
                    button.addEventListener('click', (evt) => {
                        if (this.symbol !== "XRD" && evt.target && (evt.target as HTMLElement).classList.contains("js-click")) {
                            this.SettingsStore.setChartCurrency(this.otherCurrency);
                        }
                    });
                    this.tvCurrencyBtn = button;
                    this.updateTvCurrencyBtn();
                });

            });
        },
        onNewSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            if (!this.focusListener) {
                return;
            }
            const swap: TokenSwapDto = state.lastSwap;
            const symbol = swap.tokenTo !== "XRD" ? swap.tokenTo : swap.tokenFrom;
            if (symbol === this.symbol) {
                this.focusListener();
            }
        },
        onChartSettingsChange(state: UnwrapRef<{ compactChart: string, chartCurrency: string }>) {
            if (!this.focusListener || !this.tvWidget) {
                return;
            }
            const newCurrency = state.chartCurrency;
            const currencyChanged = this.currency !== newCurrency;
            if (currencyChanged) {
                this.currency = newCurrency;
            }

            const newCompact = state.compactChart === "1";
            if (this.compact !== newCompact) {
                this.initChart(newCompact);
            } else if (currencyChanged) {
                this.updateTvSymbol(this.symbol + ":" + newCurrency);
            }
        },
        updateTvCurrencyBtn() {
            if (this.tvCurrencyBtn) {
                if (this.symbol === "XRD") {
                    this.tvCurrencyBtn.innerHTML = `Currency: <span class="d3x-currency"><span class="current">USD</span></span>`;
                } else {
                    this.tvCurrencyBtn.innerHTML = `
                        Currency: <span title="Switch Chart Currency" class="apply-common-tooltip d3x-currency c-p">
                            <span class="current js-click">${this.currency}</span>
                            <span class="other js-click">${this.otherCurrency}</span>
                        </span>`;
                }
            }
        },
        updateTvSymbol(tvSymbol: string) {
            if (tvSymbol === "XRD:XRD") {
                tvSymbol = "XRD:USD";
            }
            if (this.tvSaveLoadAdapter) {
                this.tvSaveLoadAdapter.currentSymbol = tvSymbol;
            }
            if (this.tvWidget) {
                this.tvWidget.setSymbol(tvSymbol, this.interval as ResolutionString, noop);
            }
            this.updateTvCurrencyBtn();
        },

    },
    computed: {
        SwapEventStore() {
            return useSwapEventStore();
        },
        SettingsStore() {
            return useSettingsStore();
        },
        otherCurrency() {
            return this.currency === "XRD" ? "USD" : "XRD";
        },
    },
    watch: {
        symbol(newVal) {
            this.updateTvSymbol(newVal + ":" + this.currency);
        },
    }
});
</script>

