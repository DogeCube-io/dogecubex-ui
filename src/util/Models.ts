import type { SwapModel } from "../../env";

export default class Models {

    static swapModel(swapModel: any): SwapModel {
        swapModel = swapModel || {};
        const qp = {} as SwapModel;
        if (swapModel.from) {
            qp.from = swapModel.from;
        }
        if (swapModel.to) {
            qp.to = swapModel.to;
        }
        if (swapModel.amount) {
            qp.amount = swapModel.amount;
        }
        if (swapModel.xrd) {
            qp.xrd = swapModel.xrd;
        }

        return qp;
    }

}
