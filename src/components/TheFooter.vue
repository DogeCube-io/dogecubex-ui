<template>
    <footer id="footer">
        <div>
            <div style="display: flex" class="justify-content-center contact-icons">
                <span>Community: </span>
                <ul class="list-unstyled d-flex">
                    <li class="ms-3"><a class="link-dark" target="_blank" href="https://t.me/DOGECUBE"><icon-telegram /></a></li>
                    <li class="ms-3"><a class="link-dark" target="_blank" href="https://twitter.com/Doge3_cerby"><icon-twitter /></a></li>
                    <li class="ms-3"><a class="link-dark" target="_blank" href="https://www.instagram.com/dogecube/"><icon-instagram/></a></li>
                </ul>
                <span class="ms-4" > Support: </span>
                <ul class="list-unstyled d-flex">
                    <li class="ms-3"><a class="link-dark" target="_blank" href="https://t.me/DogeCubeX"><icon-telegram /></a></li>
                </ul>
            </div>
        </div>
        <sup>&copy;</sup> DogeCubeX 2022
    </footer>
</template>

<script lang="ts">
import IconTelegram from "@/components/icons/socials/IconTelegram.vue";
import IconTwitter from "@/components/icons/socials/IconTwitter.vue";
import IconInstagram from "@/components/icons/socials/IconInstagram.vue";
export default {
    name: "TheFooter",
    components: {IconInstagram, IconTwitter, IconTelegram}
}
</script>

<style>
#footer .contact-icons .bi {
    width: 24px;
    height: 24px;
}
#footer .contact-icons a:hover {
    color: #fff;
}
</style>
