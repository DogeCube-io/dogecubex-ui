<template>
    <span>
        <span v-show="statusValue === 'ACTIVE'" class="text-success"><span class="blink">●</span> Active</span>
        <span v-show="statusValue === 'PAUSED'" class="text-warning"><span>●</span> Paused</span>
        <span v-show="statusValue === 'STOPPED'" class="text-danger"><span>⬤</span> Stopped</span>
    </span>
</template>

<script lang="ts">
import type { StatusStringDto } from "../../env";
import API from "@/util/API";

export default {
    components: {},
    data() {
        return {
            statusValue: "",

            requestId: 0,
            statusInterval: null,
        }
    },
    props: {
        symbol: {
            type: String,
            required: false
        },
        refreshInterval: {
            type: Number,
            required: true
        }
    },
    async mounted() {
        this.loadPoolStatus();
        this.statusInterval = setInterval(this.loadPoolStatus, this.refreshInterval);
        window.addEventListener('focus', this.loadPoolStatus);
    },
    unmounted() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
            this.statusInterval = null;
        }
        window.removeEventListener('focus', this.loadPoolStatus);
    },
    methods: {
        async loadPoolStatus() {
            const rand = Math.random();
            this.requestId = rand;

            try {
                const url = this.symbol
                    ? `/api/engine-status.json?symbol=${this.symbol}`
                    : `/api/engine-status.json`
                const status = await API.get(url) as StatusStringDto;
                if (this.requestId === rand) {
                    this.statusValue = status && status.status ? status.status : "STOPPED";
                }
            } catch (error) {
                if (this.requestId === rand) {
                    this.statusValue = "STOPPED";
                }
            }
        },
    },
    watch: {
        symbol(newVal, oldVal) {
            if (newVal != oldVal) {
                this.loadPoolStatus();
            }
        },
    }
}
</script>
<style>
</style>
