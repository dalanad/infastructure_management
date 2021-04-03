import { Application } from "express";

export interface IModuleConfig {
    path: string,
    entities: [],
    routes: []
}

export abstract class Module {

    protected _app: Application;
    private _config: IModuleConfig = {
        path: "",
        entities: [],
        routes: []
    }

    protected constructor(config: IModuleConfig) {
    }

    mount(app: Application) {
        this._app = app;
        this._app.use(this._config.path)
    }

    register
}