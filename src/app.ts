// import { graphqlExpress } from 'apollo-server-express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import { NextFunction, Request, Response } from 'express'
import * as graphqlHTTP from 'express-graphql'
import * as morgan from 'morgan'
import { dirname } from 'path'
import 'reflect-metadata'

import { Action, useContainer as routingUseContainer, useExpressServer } from 'routing-controllers'
import { buildSchemaSync, useContainer as graphqlContainer } from 'type-graphql'
import { Container } from 'typedi'
import { useContainer as ormUseContainer } from 'typeorm'
import User from './entities/User'
import Authorization from './middlewares/Authorization'
import JWT from './middlewares/JWT'
import { UserMiddlewares } from './middlewares/UserMiddlewares'

export const app = express()
import { createConnection } from 'typeorm'
import connectionOptions from './ormConfig'

import * as Entity from 'baiji-entity'
Entity.types = {
	string: { default: null },
	number: { default: NaN },
	boolean: { default: false },
	date: { format: 'iso', default: null },
	object: { default: {} },
  }
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors())
app.use(morgan('[:status]:method :url :response-time ms'))

routingUseContainer(Container)
ormUseContainer(Container)
graphqlContainer(Container)

export const dbConnection = async () => {
	return await createConnection(connectionOptions)
}

useExpressServer(app, {
	defaults: {
		nullResultCode: 200,
		undefinedResultCode: 200,
	},
	authorizationChecker: Authorization.prototype.authorizeChecker,
	currentUserChecker: Authorization.prototype.currentUserChecker,
	controllers: [__dirname + '/controllers/**/*.js', __dirname + '/controllers/**/*.ts'],
	// validation: true,
	// classTransformer: false,
	defaultErrorHandler: true,
})
app.use(JWT)
const schema = buildSchemaSync({
	resolvers: [__dirname + '/resolvers/**/*.resolvers.ts', __dirname + '/resolvers/**/*.resolvers.js'],
	emitSchemaFile: true,
  })
app.use('/graphql', graphqlHTTP({
	schema: schema,
	graphiql: true,
}))
