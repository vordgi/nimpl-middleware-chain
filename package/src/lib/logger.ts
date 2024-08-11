export class Logger {
    private logger?: Logger | null;

    constructor(logger?: Logger | boolean | null) {
        if (logger && logger !== true) {
            this.logger = logger;
        } else if (logger === false || logger === null) {
            this.logger = null;
        } else {
            this.logger = console;
        }
    }

    log(message: string) {
        this.logger?.log(message);
    }

    warn(message: string) {
        this.logger?.warn(message);
    }

    error(message: string) {
        this.logger?.error(message);
    }
}
