<template>
    <span class="currency-switcher">
        <input v-model="analyticsCurrencyMode" class="checkbox" type="checkbox"
               @input="onCurrencyChange" id="currency-switcher">
        <label class="label fs-6" for="currency-switcher">
            <span class="pos-usd">&nbsp;$</span>
            <span class="pos-xrd">√&nbsp;</span>
            <span class="ball"></span>
        </label>
    </span>
</template>

<script lang="ts">
import { defineComponent, UnwrapRef } from "vue";
import { useSettingsStore } from "@/stores/SettingsStore";

export default defineComponent({
    components: {},
    data() {
        return {
            analyticsCurrencyMode: false,
        }
    },
    mounted() {
        this.analyticsCurrencyMode = this.SettingsStore.analyticsCurrency === "USD";
        this.SettingsStore.subscribeAnalyticsCurrencyChange(this.onCurrencyExternalChange);
    },
    computed: {
        SettingsStore() {
            return useSettingsStore();
        },
    },
    methods: {
        onCurrencyChange(evt: Event) {
            const checked = (evt.target as HTMLInputElement).checked;
            this.SettingsStore.setAnalyticsCurrency(checked ? "USD" : "XRD");
        },
        onCurrencyExternalChange(state: UnwrapRef<{ analyticsCurrency: string }>) {
            const newMode = state.analyticsCurrency === "USD";
            if (this.analyticsCurrencyMode !== newMode) {
                this.analyticsCurrencyMode = newMode;
            }
        },
    }
});
</script>
<style lang="scss">

.currency-switcher {
    .checkbox {
        opacity: 0;
        position: absolute;
    }

    .label {
        background-color: #111;
        border-radius: 50px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px;
        position: relative;
        height: 26px;
        width: 50px;
    }

    .label .ball {
        background-color: #fff;
        border-radius: 50%;
        position: absolute;
        top: 3px;
        left: 3px;
        height: 20px;
        width: 20px;
        transform: translateX(0px);
        transition: transform 0.2s linear;
    }

    .checkbox:checked + .label {
        .ball {
            transform: translateX(24px);
        }
    }

    .pos-usd {
        color: limegreen;
    }

    .pos-xrd {
        color: green;
    }
}

</style>
