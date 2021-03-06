// import { graphqlExpress } from 'apollo-server-express'
import { ApolloServer } from 'apollo-server-express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as morgan from 'morgan'
import 'reflect-metadata'
import { useContainer as routingUseContainer, useExpressServer } from 'routing-controllers'
import { useContainer as socketUseContainer } from 'socket-controllers'

import { buildSchemaSync } from 'type-graphql'
import { Container } from 'typedi'
import { useContainer as ormUseContainer } from 'typeorm'
import Authorization from './middlewares/Authorization'
import JWT from './middlewares/JWT'

export const app = express()
import { ContainerInstance } from 'typedi'
import { createConnection } from 'typeorm'
import connectionOptions from './ormConfig'

export interface Context {
  user: User
  container: ContainerInstance
}

import { GraphQLResolveInfo } from 'graphql'
import User from './entities/User'

export interface ArgsDictionary {
  [argName: string]: any
}

export interface ResolverData<ContextType = {}> {
  root: any
  args: ArgsDictionary
  context: ContextType
  info: GraphQLResolveInfo
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('[:status]:method :url :response-time ms'))

routingUseContainer(Container)
ormUseContainer(Container)
socketUseContainer(Container)

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
	authChecker: Authorization.prototype.customAuthChecker,
	authMode: 'null',
	// container: Container,
	container: ({ context }: ResolverData<Context>) => context.container,

})

const server = new ApolloServer({
	schema: schema,
	playground: true,
	tracing: true,
	context: ({ req }) => {
		const context = {
		  user: req.user, // `req.user` comes from `express-jwt`
		}
		return context
	},
})
server.applyMiddleware({ app: app, path: '/graphql' })
