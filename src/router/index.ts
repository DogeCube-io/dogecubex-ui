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
        } else if (to.hash) {
            return new Promise((resolve, reject) => {
                let offset = 60;
                try {
                    offset = document.getElementsByTagName('header')[0].offsetHeight;
                } catch (e) {
                    // ignore
                }
                setTimeout(() => {
                    resolve({
                        el: to.hash,
                        top: offset + 40,
                        behavior: 'smooth',
                    })
                }, 550)
            });
        } else if (from.path !== to.path) {
            return {top: 0};
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
                path: "/how-to",
                name: "how-to",
                component: HowToSwapView,
            }, 'How To'),
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
                path: "/info",
                name: "info",
                component: TokenDetailsView,
            }, 'Info'),


        // last
        dogeRoute(
            {
                path: "/:pathMatch(.*)*",
                name: "not-found",
                component: NotFoundView,
            }, 'Not Found'),

    ],
});

function isEmpty(object: Record<string, unknown>): boolean {
    for (const p in object) {
        if (object.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
}

function isEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
    const props1 = Object.getOwnPropertyNames(obj1);
    const props2 = Object.getOwnPropertyNames(obj2);
    if (props1.length !== props2.length) {
        return false;
    }
    for (let i = 0; i < props1.length; i++) {
        const val1 = obj1[props1[i]];
        const val2 = obj2[props1[i]];
        if (val1 !== val2) {
            return false;
        }
    }
    return true;
}

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

    if (to.name === from.name) {
        if (isEmpty(to.query) || isEqual(from.query, to.query)) {
            next(false);
        } else {
            (<any>to).force = true;
            next();
        }

    } else {
        next();
    }

});


router.onError((error) => {
    console.log(error);
    useGlobalErrorStore().setError(error && error.message);
});

export default router;
