<template>
    <header class="site-header sticky-top">
        <nav class="navbar navbar-expand-sm navbar-dark bg-dark" :class="`page-${activePage && activePage.toLowerCase()}`">
            <div class="container-xxl">
                <span class="separator"></span>
                <a class="navbar-brand logo-wrap me-md-auto doge-logo" href="/">
                    <img v-if="showImages" src="/image/logo-default.png" alt="">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#site-navbar"
                        aria-controls="site-navbar" aria-expanded="false" aria-label="Menu">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="site-navbar">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item" v-bind:key="page" v-for="page in headerItems"
                            :class="'menu-link-' + page.toLowerCase()">
                            <RouterLink :to="'/' + page.toLowerCase()" class="nav-link"
                                        :class="page === activePage ? 'active' : ''"
                                        :aria-current="page === activePage ? 'page' : ''">{{ page }}
                            </RouterLink>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" :class="dropdownClass"
                               href="#" id="menu-dropdown" data-bs-toggle="dropdown" aria-expanded="false">More</a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="menu-dropdown">
                                <li v-for="(item, alias) in dropDownItems" v-bind:key="alias">
                                    <RouterLink :to="item.url" class="dropdown-item"
                                                :class="this.activePage === alias ? 'active' : '' ">{{ item.name }}
                                    </RouterLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script lang="ts">
const dropDownItems: { [key: string]: { name: string; url: string; } } = {
    About: {
        name: "About",
        url: "/about",
    },
    HowTo: {
        name: "How To Swap",
        url: "/how-to",
    },
    Tokens: {
        name: "Tokens",
        url: "/tokens",
    },
    Stakers: {
        name: "Staking",
        url: "/stakers",
    },
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
            return ["Swap", "Info", "Chart", "Analytics",  "FAQ"];
        },
        dropdownClass(): string {
            return dropDownItems[this.activePage] ? "active" : "";
        },
        dropDownItems() {
            return dropDownItems;
        }
    }
}
</script>

<style scoped>

</style>
