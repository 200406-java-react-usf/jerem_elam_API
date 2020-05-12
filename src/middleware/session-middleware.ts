import session from 'express-session';
const sessionConfig = {
	secret: 'magic the gathering',
	cookie: {
		secure: false
	},
	resave: false,
	saveUninitialized: false
};

export const sessionMiddleware = session(sessionConfig);