<template>
    <header class="site-header sticky-top">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <a class="navbar-brand logo-wrap me-md-auto" href="/">
                    <img v-if="showImages" style="zoom: 0.5;margin-left: -82px;" src="/image/logo-default.png" alt="">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#site-navbar"
                        aria-controls="site-navbar" aria-expanded="false" aria-label="Menu">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="site-navbar">
                    <ul class="navbar-nav ms-md-auto mb-2 mb-lg-0">
                        <li class="nav-item" v-bind:key="page" v-for="page in headerItems"
                            :class="'menu-link-' + page.toLowerCase()">
                            <a class="nav-link" :class="page === activePage ? 'active' : ''"
                               :aria-current="page === activePage ? 'page' : ''"
                               :href="'/' + page.toLowerCase()">{{ page }}</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" :class="dropdownClass"
                               href="#" id="menu-dropdown" data-bs-toggle="dropdown" aria-expanded="false">Info</a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="menu-dropdown">
                                <li><a class="dropdown-item" :class="'About' === activePage ? 'active' : ''"
                                       href="/about">About</a>
                                </li>
                                <li><a class="dropdown-item" :class="'Info' === activePage ? 'active' : ''"
                                       href="/info">How To Swap</a></li>
                                <li><a class="dropdown-item" :class="'Tokens' === activePage ? 'active' : ''"
                                       href="/tokens">Tokens</a>
                                </li>
                                <li><a class="dropdown-item" :class="'Stakers' === activePage ? 'active' : ''"
                                       href="/stakers">Staking</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script lang="ts">
const dropDownItems: { [key: string]: string } = {
    Info: "active",
    About: "active",
    Tokens: "active",
    Stakers: "active",
};

export default {
    name: "TheHeader",
    props: {
        showImages: {
            type: Boolean,
            required: true
        },
        activePage: {
            type: String,
            required: true
        },
        blacklistedIP: Boolean,
    },
    computed: {
        headerItems(): string[] {
            return ["Swap", "Analytics", "FAQ"];
        },
        dropdownClass(): string {
            return dropDownItems[this.activePage] || "";
        },
    }
}
</script>

<style scoped>

</style>
