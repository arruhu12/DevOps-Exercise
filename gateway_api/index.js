'use strict';

import { join } from 'path';
import { createServer } from 'http';

import { expressAppConfig as _expressAppConfig } from 'oas3-tools';
import { connect } from './DatabaseService.js';

var serverPort = 8000;

// swaggerRouter configuration
var options = {
    routing: {
        controllers: join(__dirname, './controllers')
    },
};

var expressAppConfig = _expressAppConfig(join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();

// Initialize the Swagger middleware
createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

