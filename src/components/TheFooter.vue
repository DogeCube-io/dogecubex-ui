<template>
    <footer id="footer">
        <div>
            <div v-if="showSocials" style="display: flex" class="justify-content-center contact-icons">
                <span>Community: </span>
                <ul class="list-unstyled d-flex">
                    <li class="ms-3">
                        <a class="link-dark" target="_blank" href="https://t.me/DOGECUBE">
                            <icon-telegram />
                        </a>
                    </li>
                    <li class="ms-3">
                        <a class="link-dark" target="_blank" href="https://twitter.com/Doge3_cerby">
                            <icon-twitter />
                        </a>
                    </li>
                    <li class="ms-3">
                        <a class="link-dark" target="_blank" href="https://www.instagram.com/dogecube/">
                            <icon-instagram />
                        </a>
                    </li>
                    <li class="ms-3">
                        <a class="link-dark" target="_blank" href="https://github.com/DogeCube-io">
                            <icon-github />
                        </a>
                    </li>
                </ul>
                <span class="ms-4"> Support: </span>
                <ul class="list-unstyled d-flex">
                    <li class="ms-3">
                        <a class="link-dark" target="_blank" href="https://t.me/DogeCubeX">
                            <icon-telegram />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <sup>&copy;</sup>&nbsp;DogeCubeX 2022
        <span class="ms-3">XRD prices by
            <a class="ms-2 link-dark" href="https://www.coingecko.com/en/api" target="_blank"><icon-gecko/></a>
        </span>
    </footer>
</template>

<script lang="ts">
import IconTelegram from "@/components/icons/socials/IconTelegram.vue";
import IconTwitter from "@/components/icons/socials/IconTwitter.vue";
import IconInstagram from "@/components/icons/socials/IconInstagram.vue";
import { useRoute } from "vue-router";
import { defineComponent } from "vue";
import IconGithub from "@/components/icons/socials/IconGithub.vue";
import IconGecko from "@/components/icons/socials/IconGecko.vue";

export default defineComponent({
    name: "TheFooter",
    components: {IconGecko, IconGithub, IconInstagram, IconTwitter, IconTelegram},
    computed: {
        showSocials() {
            const route = useRoute();
            return route.path !== "/";
        }
    }
});
</script>

<style>
#footer .contact-icons .bi {
    width: 24px;
    height: 24px;
}
#footer {
    margin-bottom: 10px;
}
</style>
