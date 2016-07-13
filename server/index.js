import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import middleware from './middleware';
import api from './api';

var app = express();
app.server = http.createServer(app);

// 3rd party middleware
app.use(cors({
	exposedHeaders: ['Link']
}));

app.use(bodyParser.json({
	limit : '100kb'
}));

// internal middleware
app.use(middleware());

// api router
app.use('/api', api());

app.server.listen(process.env.PORT || 3000);

console.log(`Started on port ${app.server.address().port}`);

export default app;
