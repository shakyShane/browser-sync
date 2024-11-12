export interface InitOptions {
    logLevel: string;
    plugins: any[];
    port: number;
    snippetOptions: ISnippetOptions;
    reloadDebounce: number;
    mode: string;
    scriptPaths: IScriptPaths;
    server: IServer;
    logFileChanges: boolean;
    reloadThrottle: number;
    clientEvents: string[];
    urls: IUrls;
    hostnameSuffix: boolean;
    scrollElements: any[];
    scheme: string;
    startPath: null;
    single: boolean;
    host: null;
    codeSync: boolean;
    watchEvents: string[];
    browser: string;
    notify: boolean | { styles: {[index: string]: string} | string[]};
    open: boolean;
    reloadDelay: number;
    minify: boolean;
    rewriteRules: any[];
    injectFileTypes: string[];
    cors: boolean;
    proxy: boolean;
    tagNames: { [index: string]: string };
    scrollRestoreTechnique: string;
    watch: boolean;
    watchOptions: IWatchOptions;
    cwd: string;
    logConnections: boolean;
    ghostMode: IGhostMode;
    middleware: IMiddlewareItem[];
    ignore: any[];
    injectChanges: boolean;
    excludedFileTypes: string[];
    online: boolean;
    socket: ISocket;
    ui: IUi;
    userPlugins: any[];
    session: number;
    logPrefix: string;
    scrollThrottle: number;
    reloadOnRestart: boolean;
    localOnly: boolean;
    files: IFiles;
    version: string;
    logSnippet: boolean;
    snippet: string;
    timestamps: boolean;
    serveStatic: any[];
    scrollElementMapping: any[];
    scrollProportionally: boolean;
}

interface ISnippetOptions {
    async: boolean;
    whitelist: any[];
    blacklist: any[];
    rule: IRule;
}

interface IRule {
    match: IMatch;
}

interface IMatch {}

interface IScriptPaths {
    path: string;
    versioned: string;
}

interface IServer {
    baseDir: string[];
    serveStaticOptions: IServeStaticOptions;
}

interface IServeStaticOptions {
    index: string;
}

interface IUrls {
    local: string;
    external: string;
    ui: string;
    "ui-external": string;
}

interface IWatchOptions {
    ignoreInitial: boolean;
    cwd: string;
    ignored: IIgnoredItem[];
}

interface IIgnoredItem {}

interface IGhostMode {
    clicks: boolean;
    scroll: boolean;
    location: boolean;
    forms: IForms;
}

interface IForms {
    submit: boolean;
    inputs: boolean;
    toggles: boolean;
}

interface IMiddlewareItem {
    route: string;
    id: string;
}

interface ISocket {
    socketIoOptions: ISocketIoOptions;
    socketIoClientConfig: ISocketIoClientConfig;
    path: string;
    clientPath: string;
    namespace: string;
    clients: IClients;
}

interface ISocketIoOptions {
    log: boolean;
}

interface ISocketIoClientConfig {
    reconnectionAttempts: number;
}

interface IClients {
    heartbeatTimeout: number;
}

interface IUi {
    port: number;
}

interface IFiles {
    core: ICore;
}

interface ICore {
    globs: any[];
    objs: any[];
}
