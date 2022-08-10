import { default as SockJS } from "sockjs-client/dist/sockjs";
import { Stomp } from "@stomp/stompjs";
import { useSwapEventStore } from "@/stores/SwapEventStore";
import type { CompatClient } from "@stomp/stompjs/esm6/compatibility/compat-client";
import type { IFrame } from "@stomp/stompjs/src/i-frame";
import { noop } from "@vueuse/core";


class WsConnector {
    private connected = false;
    private stompClient: CompatClient | undefined;
    private store = useSwapEventStore();

    connect() {
        this.stompClient = Stomp.over(() => {
            return new SockJS("https://dogecubex.live/ws");
        });
        this.stompClient.debug = noop;
        this.stompClient.connect(
            {},
            (frame: IFrame) => {
                this.connected = true;
                this.stompClient?.subscribe("/swaps/XRD", tick => {
                    const swap = JSON.parse(tick.body);
                    this.store.setLastSwap(swap);
                });
            },
            (error: IFrame) => {
                console.log(error);
                this.connected = false;
                setTimeout(() => {
                    if (!this.connected) {
                        this.connect();
                    }
                }, 10000);
            }
        );
    }

}

export default WsConnector;
