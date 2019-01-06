import * as Entity from 'baiji-entity'
import { Request } from 'express'
import { Authorized, BodyParam, CurrentUser, Get, JsonController, NotFoundError, Param, Post, Put } from 'routing-controllers'
import User from '../entities/User'

@JsonController('/likes')
export class LikeController {

}
