export default class API {
    static baseUrl = "https://dogecubex.live";

    static async get(url: string): Promise<any> {
        return (await fetch(this.baseUrl + url, {cache: "no-store"})).json();
    }

    static async postRaw(url: string, body: object): Promise<any> {
        return (await fetch(this.baseUrl + url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            cache: "no-store",
            body: JSON.stringify(body)
        }));
    }

}
