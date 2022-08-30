<template>
    <main class="container-xxl">
        <div class="my-1 text-center">
            <div class="TVChartContainer" ref="chartContainer" />
        </div>
    </main>

</template>

<script lang="ts">
import type {
    ChartingLibraryWidgetOptions, IChartingLibraryWidget, ResolutionString
} from '../../public/charting_library';
import { widget } from '../../public/charting_library';
import { UDFCompatibleDatafeed } from "../../lib/datafeeds/udf/src/udf-compatible-datafeed";
import TVSaveLoadAdapter from "@/util/TVSaveLoadAdapter";
import API from "@/util/API";
import { defineComponent } from "vue";
import { noop } from "@vueuse/core";

export default defineComponent({
    data() {
        return {
            tvWidget: null as null | IChartingLibraryWidget,
            tvSaveLoadAdapter: null as null | TVSaveLoadAdapter,
            tvDataFeed: null as null | UDFCompatibleDatafeed,
            tvCurrencyBtn: null as null | HTMLElement,
            focusListener: null as null | (() => void),

            symbol: "DGC",
            currency: "XRD",
            interval: "60",
            width: "1280",
            height: "720",
            zoom: "1",

        };
    },
    mounted() {
        this.symbol = this.$route.query.symbol as string || this.symbol;
        this.currency = this.$route.query.currency as string || this.currency;
        this.interval = this.$route.query.interval as string || this.interval;
        this.width = this.$route.query.width as string || this.width;
        this.height = this.$route.query.height as string || this.height;
        this.zoom = this.$route.query.zoom as string || this.zoom;

        this.initChart();

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
        initChart() {
            /** In the lib, do: find "this._updateLoadingState,700", replace with "this._updateLoadingState,200" */
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
                disabled_features: [
                    'header_compare',
                    'display_market_status',
                    'header_symbol_search',
                    'symbol_search_hot_key',
                    'left_toolbar',
                    'control_bar',
                    'timeframes_toolbar',
                    'header_chart_type',
                    'header_indicators',
                    'header_undo_redo',
                    'header_saveload'
                ],
                enabled_features: ['use_localstorage_for_settings', 'pricescale_currency'],
                save_load_adapter: tvSaveLoadAdapter,
                load_last_chart: false,
                favorites: {
                    intervals: [
                        this.interval as ResolutionString,
                    ],
                    chartTypes: []
                },
                time_frames: [],
                client_id: "dogecubex.live",
                user_id: userId,
                header_widget_buttons_mode: 'adaptive',
                fullscreen: false,
                width: Number(this.width),
                height: Number(this.height),
                studies_overrides: {},
                overrides: {
                    "scalesProperties.showStudyLastValue": false,
                    "mainSeriesProperties.highLowAvgPrice.highLowPriceLabelsVisible": true,
                },
                custom_css_url: "/css/tv-overrides-print.css?_v=1",
                theme: "Dark",
            } as ChartingLibraryWidgetOptions;


            const tvWidget = new widget(widgetOptions);

            this.tvWidget = tvWidget;
            this.tvSaveLoadAdapter = tvSaveLoadAdapter;
            this.tvDataFeed = dataFeed;

            function initChartIndicators() {
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


            tvWidget.onChartReady(() => {
                initChartIndicators();
                tvWidget.activeChart().onSymbolChanged().subscribe(null, () => {
                    tvSaveLoadAdapter.currentSymbol = tvWidget.activeChart().symbol();
                });
                tvWidget.headerReady().then(() => {
                    this.tvCurrencyBtn = tvWidget.createButton();
                    this.updateTvCurrencyBtn();
                });


                const zoomOut = () => {
                    try {
                        const element = (tvWidget as any)._iFrame.contentDocument.getElementsByClassName("chart-gui-wrapper")[0];
                        const box = element.getBoundingClientRect();
                        const clientX = box.left + box.width - 64;
                        const clientY = box.top + box.height / 2;
                        const target = element.ownerDocument.elementFromPoint(clientX, clientY) as Element;

                        for (let e = target; e; e = e.parentElement as Element) {
                            if (e === element) {
                                target.dispatchEvent(new MouseEvent('mouseover', {
                                    view: window,
                                    bubbles: true,
                                    cancelable: true,
                                    clientX: clientX,
                                    clientY: clientY
                                }));
                                target.dispatchEvent(new MouseEvent('mousemove', {
                                    view: window,
                                    bubbles: true,
                                    cancelable: true,
                                    clientX: clientX,
                                    clientY: clientY
                                }));
                                target.dispatchEvent(new WheelEvent('wheel', {
                                    view: window,
                                    ctrlKey: true,
                                    bubbles: true,
                                    cancelable: true,
                                    clientX: clientX,
                                    clientY: clientY,
                                    deltaY: -100
                                }));
                                return;
                            }
                        }

                    } catch (e) {
                        console.log(e);
                    }
                };

                const zoom = Number(this.zoom);

                for (let i=0; i<zoom; i++) {
                    setTimeout(function () {
                        zoomOut();
                    }, i * 15);
                }
            });
        },
        updateTvCurrencyBtn() {
            if (this.tvCurrencyBtn) {
                const clazz = [this.symbol, this.currency, this.interval, this.width, this.height].join("-");
                this.tvCurrencyBtn.innerHTML = `Currency: <span class="${clazz}"><span class="current">${this.currency}</span></span>`;
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
    computed: {},
});
</script>

<style lang="scss">


</style>
