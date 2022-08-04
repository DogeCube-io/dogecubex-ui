import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import type { MetaTag, RouteRecordWithTitle } from "../../env";
import HowToSwapView from "@/views/HowToSwapView.vue";
import TokensView from "@/views/TokensView.vue";
import StakersView from "@/views/StakersView.vue";
import FAQView from "@/views/FAQView.vue";
import SwapView from "@/views/SwapView.vue";
import ChartView from "@/views/ChartView.vue";
import AnalyticsView from "@/views/AnalyticsView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import { useGlobalErrorStore } from "@/stores/GlobalErrorStore";
import TokenDetailsView from "@/views/TokenDetailsView.vue";

function dogeRoute(route: RouteRecordRaw, pageName: string): RouteRecordWithTitle {
    const title = `DogeCubeX | ${pageName}`;
    return <RouteRecordWithTitle>{
        meta: {
            title: title,
            metaTags: [
                {
                    property: "og:title",
                    content: title,
                },
            ],
        },
        ...route
    }
}

const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
        // always scroll to top
        // return { top: 0 }
    },
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        dogeRoute(
            {
                path: "/",
                name: "home",
                component: HomeView,
            }, "Home"
        ),
        dogeRoute(
            {
                path: "/swap",
                name: "swap",
                component: SwapView,
            }, 'Swap'),

        dogeRoute(
            {
                path: "/about",
                name: "about",
                component: AboutView,
            }, 'About'),
        dogeRoute(
            {
                path: "/info",
                name: "info",
                component: HowToSwapView,
            }, 'Info'),
        dogeRoute(
            {
                path: "/tokens",
                name: "tokens",
                component: TokensView,
            }, 'Tokens'),
        dogeRoute(
            {
                path: "/stakers",
                name: "stakers",
                component: StakersView,
            }, 'Stakers'),
        dogeRoute(
            {
                path: "/faq",
                name: "faq",
                component: FAQView,
            }, 'FAQ'),
        dogeRoute(
            {
                path: "/chart",
                name: "chart",
                component: ChartView,
            }, 'Chart'),
        dogeRoute(
            {
                path: "/analytics",
                name: "analytics",
                component: AnalyticsView,
            }, 'Analytics'),
        dogeRoute(
            {
                path: "/token",
                name: "token-info",
                component: TokenDetailsView,
            }, 'Token'),


        // last
        dogeRoute(
            {
                path: "/:pathMatch(.*)*",
                name: "not-found",
                component: NotFoundView,
            }, 'Not Found'),

    ],
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = <string>to.meta.title;
    }
    const metaTags = <Array<MetaTag>>to.meta.metaTags;
    if (metaTags) {
        metaTags.forEach(tag => {
            const element = document.querySelector(`meta[property="${tag.property}"]`);
            if (element) {
                element.setAttribute("content", tag.content);
            }
        });
    }

    next();
});


router.onError((error) => {
    console.log(error);
    useGlobalErrorStore().setError(error && error.message);
});

export default router;
