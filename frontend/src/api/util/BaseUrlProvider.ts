export default class BaseUrlProvider {
    static isDevelopment(): boolean {
        const host = window.location.host;
        return (
            host.startsWith("localhost") || host.endsWith("-dev.muenchen.de")
        );
    }

    static getBaseUrl(): string {
        const location = window.location;
        if (location.host === "localhost:8085") {
            return `${location.protocol}//localhost:8083`;
        }
        return `${location.protocol}//${location.host}`;
    }

    static getBaseUrlDatenportal(): string {
        const location = window.location;
        if (location.host === "localhost:8085") {
            return `${location.protocol}//localhost:8081`;
        } else if (location.host === "localhost:8083") {
            return `${location.protocol}//localhost:8082`;
        } else {
            // Ich bin auf dem Server und muss das Portal wechseln
            let hostname: string = location.host;
            hostname = hostname.replace("-adminportal", "");
            return `${location.protocol}//${hostname}`;
        }
    }
}
