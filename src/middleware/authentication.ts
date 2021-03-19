const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var FileStore = require("session-file-store")(session);
const users = [ { id: "2f24vvg", email: "test@test.com", password: "password" } ];

// configure passport.js to use the local strategy 
passport.use(
    new LocalStrategy({}, (email, password, done) => {
        const user = users[ 0 ];
        if (email === user.email && password === user.password) {
            return done(null, user);
        }
        return done(null, false, { message: "Wrong" });
    })
);

// tell passport how to serialize the user
passport.serializeUser((user, done) => { console.log(user); done(null, user.id); });
passport.deserializeUser(function (id, done) {
    done(null, id);
});

function addAuth(app) {
    app.use(
        session({
            store: new FileStore({}),
            secret: "sskeyboard cat",
            resave: false,
            saveUninitialized: true,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        res.locals.frame = req.headers[ "turbo-frame" ];
        if (!req.user) {
            return res.redirect("/auth/login");
        }
        res.locals.title = "Application";
        next();
    });

}

export { addAuth }