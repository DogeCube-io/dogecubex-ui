<template>
    <div class="dropdown bootstrap-select">
        <v-select :options="pools" v-model="poolModel" :filter-by="poolFilterFunc"
                  :get-option-key="getPoolSymbol" :get-option-label="getPoolSymbol"
                  :placeholder="simpleView ? 'Switch Token' : 'Select your pool'" class="pool-select" :clearable="false"
                  @option:selected="onPoolSelected">
            <template v-slot:option="pool">
                <span class="badge badge-success">
                    <img v-if="pool.heroImageUrl" style="width:32px;height:32px;"
                         :src="pool.token.iconUrl" :alt="pool.token.name">
                    <span class="ms-2">{{ getPoolPair(pool) }}</span><small
                    class="text-white ms-2">{{ pool.token.name }}</small>
                </span>
            </template>
            <template v-slot:selected-option="pool">
                <span v-if="!simpleView" class="badge badge-success">
                    <img v-if="pool.heroImageUrl" style="width:32px;height:32px;"
                         :src="pool.token.iconUrl" :alt="pool.token.name">
                    <span class="ms-2">{{ getPoolPair(pool) }}</span><small
                    class="text-white ms-2">{{ pool.token.name }}</small>
                </span>
                <span v-else class="badge badge-success">
                    <span class="text-center"><small>Switch Token</small></span>
                </span>
            </template>
        </v-select>
    </div>
</template>

<script lang="ts">
import type { PoolInfoDto } from "../../env";
import API from "@/util/API";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import Utils from "@/util/Utils";

export default defineComponent({
    components: {},
    data() {
        return {
            pools: [] as PoolInfoDto[],
            poolModel: null as (PoolInfoDto | null),
        }
    },
    props: {
        modelValue: Object as PropType<PoolInfoDto>,
        simpleView: Boolean,
        showXrd: Boolean,
        initialSelection: {
            type: String,
            required: true
        }
    },
    async mounted() {
        this.poolModel = this.modelValue as PoolInfoDto;
        this.loadPoolInfo();
    },
    methods: {
        getPoolSymbol(p: PoolInfoDto) {
            return p.token.symbol;
        },
        getPoolPair(p: PoolInfoDto) {
            return !this.showXrd ? p.token.symbol + "/XRD" : p.token.symbol;
        },
        async loadPoolInfo() {
            const pools = await API.get("/api/pools-info.json") as PoolInfoDto[];
            if (this.showXrd && pools.length) {
                pools.unshift({
                    token: Utils.XRD_TOKEN,
                    account: "",
                    heroImageUrl: "/hero-swap-DGC.png",
                });
            }
            let selectedPool;
            for (let i = 0; i < pools.length; i++) {
                const pool = pools[i];
                if (pool.token.symbol === this.initialSelection) {
                    selectedPool = pool;
                }
            }
            this.pools = pools;
            this.onPoolSelected(selectedPool);
        },
        poolFilterFunc(option: PoolInfoDto, label: string, search: string) {
            if (!search) {
                return true;
            }
            const s = search.toLowerCase();
            return (option.token.symbol).toLowerCase().indexOf(s) > -1 ||
                (option.token.name).toLowerCase().indexOf(s) > -1;
        },
        onPoolSelected(pool?: PoolInfoDto) {
            this.poolModel = pool as PoolInfoDto;
            this.$emit('update:modelValue', pool);
            this.$emit('onPoolSelected');
        },
    }
});
</script>
<style>

.pool-select {
    position: relative;
    width: 100%;
    text-align: right;
    white-space: nowrap;
    cursor: pointer;
    color: #fff;
    background-color: #555;

    font-weight: 400;
    line-height: 1.5;
    /*text-decoration: none;*/
    /*vertical-align: middle;*/

    /*border: 1px solid #555;*/
    /*padding: 0.375rem 1rem;*/
    font-size: 1rem;
    border-radius: 0.25rem;
    transition: color .15s
}

.pool-select > ul {
    font-size: 1rem;
    color: #adafae;
    text-align: left;
    background-color: #282828;
    background-clip: padding-box;
}

.pool-select.vs--searchable .vs__dropdown-toggle {
    cursor: pointer;
}

.pool-select.vs--searchable .vs__dropdown-toggle .vs__search {
    line-height: 2.5;
}

.pool-select.vs--searchable .vs__dropdown-toggle[aria-expanded="false"] .vs__search {
    height: 0;
}
.pool-select.vs--searchable .vs__dropdown-toggle[aria-expanded="true"] .vs__selected {
    visibility: hidden;
}

.pool-select.vs--searchable:not(.vs--open) .vs__dropdown-toggle .vs__search {
    cursor: pointer;
}

.pool-select.vs--searchable .vs__dropdown-toggle .vs__search {
    background-color: #555;
    opacity: 0.65;
}

.pool-select.vs--searchable .vs__selected {
    padding: 0;
}

body .container .dropdown.bootstrap-select:not([class*=col-]):not([class*=form-control]):not(.input-group-btn),
body .container-xxl .dropdown.bootstrap-select:not([class*=col-]):not([class*=form-control]):not(.input-group-btn) {
    width: 310px;
}
</style>
