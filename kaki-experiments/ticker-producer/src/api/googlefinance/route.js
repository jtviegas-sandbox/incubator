/**
 * Created by joaovieg on 12/03/17.
 */
"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('../common/apputils').logger;
var decorator = require('../common/decorator');
var config = require('../common/config');
var functions = require('./functions');
var sink = require('../sink/sinkFactory').getInstance();

logger.debug('[googlefinance.route] started loading...');
sink.init(config.constants.ZOOKEEPER_IP, config.constants.ZOOKEEPER_PORT);
var router = express.Router();
router.use(bodyParser.json({limit: '10mb'})); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // for parsing application/x-www-form-urlencoded

/**
 * @swagger
 * definitions:
 *   Ticker:
 *     type: object
 *     properties:
 *       symbol:
 *         type: string
 *       exchange:
 *         type: string
 *     required:
 *     - symbol
 *     - exchange
 *     example:
 *       symbol: BAE
 *       exchange: LON
 *   DefaultMessage:
 *     type: object
 *     properties:
 *       ok:
 *         type: boolean
 *       msg:
 *         type: string
 *     required:
 *     - ok
 *     example:
 *       ok: true
 *       msg: mission accomplished
 *   Series:
 *     type: object
 *     properties:
 *       measurement:
 *         type: string
 *       tags:
 *         type: array
 *         items:
 *           type: string
 *       fields:
 *         type: array
 *         items:
 *           type: string
 *       ts:
 *         type: int64
 *     required:
 *     - measurement
 *     - tags
 *     - fields
 *     - ts
 *   Envelope:
 *     type: object
 *     properties:
 *       src:
 *         type: string
 *       series:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Series'
 *       type:
 *         type: string
 *       topic:
 *         type: string
 *     required:
 *     - measurement
 *     - tags
 *     - fields
 *     - ts
 */

/**
 * @swagger
 * /api/googlefinance:
 *   post:
 *     description: gets stock series from google finance api and delivers it to the configured sink
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: Ticker
 *       description: ticker object
 *       in: body
 *       required: true
 *       schema:
 *         $ref: '#/definitions/Ticker'
 *     responses:
 *       '200':
 *         description: successfully delivered the series to sink
 *         schema:
 *           $ref: '#/definitions/DefaultMessage'
 */
router.post('/', functions.process, decorator.process, sink.process);

logger.debug('[googlefinance.route] ...finished loading.');
module.exports = router;