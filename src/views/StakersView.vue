<template>
    <TheHeader active-page="Stakers" :show-images="true" />
    <main>
        <div class="px-4 my-5">
            <h1 class="display-6 fw-bold">&nbsp;</h1>
            <div class="mx-auto container d3x-text-white">
                <div class="my-3 py-3 stakers-container">
                    <h4 class="text-white text-center">Benefits for Stakers</h4>
                    <p class="text-center">Staking on the <a
                        href="https://explorer.radixdlt.com/#/validators/rv1qd9wlc66dzssnkzwja2mrnxsdezzkmxg00xqzrkn4039zpghaj0rs43mz63"
                        target="_blank">🐶 DogeCube</a> Node gives the next benefits:</p>
                    <p>1. Increased trade limit, depending on the staked amount:</p>
                    <ul class="list-group lg-short">
                        <li v-for="limit in responseDto.stakingLimits" v-bind:key="limit.first" class="list-group-item">
                            Stake > <code
                        >{{ limit.first + ' XRD' }}</code>
                            - get <span>{{ limit.second }}</span> XRD trade limit
                        </li>
                        <li class="list-group-item">Everyone else
                            - <span>{{ responseDto.defaultLimit }}</span> XRD trade limit
                        </li>
                    </ul>
                    <p>You can do as many trades as you'd like, only the amount per trade is limited.</p>
                    <br>
                    <p>2. Coming soon...</p>
                </div>
                <div class="shadow-sm mx-auto py-3" style="border-radius: 21px 21px 0 0;">
                    <div style="width:100%;">
                        <div class="input-group mb-3">
                            <input class="form-control" id="stakers-filter" type="text" placeholder="Search.."
                                   v-model="stakersFilter" aria-label="Search.." aria-describedby="basic-addon2">
                            <span class="input-group-text" id="basic-addon2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             class="bi bi-search" viewBox="0 0 16 16">
                          <path
                              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </span>
                        </div>
                    </div>
                    <table class="table table-striped stakers-table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Account</th>
                            <th scope="col">Staked Amount, XRD</th>
                            <th scope="col">Max per Trade, XRD</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(staker, index) in responseDto.stakers" v-bind:key="staker.address"
                            :class="{'hide': staker.address.indexOf(stakersFilter) === -1}">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ staker.address }}</td>
                            <td><code>{{ staker.stake }}</code></td>
                            <td>{{ staker.tradeLimit }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </main>
</template>

<style>
.accordion-body {
    color: #ddd;
}

.stakers-container {
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
}

.list-group.lg-short {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

.stakers-table td:first-of-type {
    text-overflow: ellipsis;
    overflow-wrap: anywhere;
}
</style>
<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import type { StakerResponseDto } from "../../env";
import API from "@/util/API";
import { defineComponent } from "vue";

export default defineComponent({
    components: {TheHeader},
    data() {
        return {
            responseDto: {} as StakerResponseDto,
            stakersFilter: ''
        }
    },
    props: {},
    async mounted() {
        this.responseDto = await API.get("/api/stakers.json") as StakerResponseDto;
    },
    methods: {},
    computed: {},
});
</script>
