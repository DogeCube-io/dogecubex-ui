import { default as SockJS } from "sockjs-client/dist/sockjs";
import { Stomp } from "@stomp/stompjs";
import { useSwapEventStore } from "@/stores/SwapEventStore";


class WsConnector {
    private connected = false;
    private stompClient: Stomp;
    private store = useSwapEventStore();

    connect() {
        this.stompClient = Stomp.over(() => {
            return new SockJS("https://dogecubex.live/ws");
        });
        this.stompClient.debug = function () {
        };
        this.stompClient.connect(
            {},
            frame => {
                this.connected = true;
                this.stompClient.subscribe("/swaps/XRD", tick => {
                    const swap = JSON.parse(tick.body);
                    this.store.setLastSwap(swap);
                });
            },
            error => {
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
