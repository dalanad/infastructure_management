const session = require("express-session");
var FileStore = require("session-file-store")(session);
 
function addAuth(app) {
    app.use(
        session({
            store: new FileStore({}),
            secret: "sskeyboard cat",
            resave: false,
            saveUninitialized: true,
        })
    ); 
    

    app.use((req, res, next) => {
        res.locals.frame = req.headers[ "turbo-frame" ];
        if (!req.session.uid && req.originalUrl != '/auth/login/') {
            return res.redirect("/auth/login/");
        }
        res.locals.title = "Application";
        next();
    });

}

export { addAuth }