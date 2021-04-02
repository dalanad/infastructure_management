export class Logger {

    constructor(private name: string = "application") {
    }
    this(){
        return this
    }
    info(params) {
        console.info(`[${ this.name }]`, params)
    }

    error(params) {
        console.error(`[${ this.name }]`, params)
    }
}

export const logger = new Logger()