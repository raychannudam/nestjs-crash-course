import { UserService } from './user.service';
import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { isArray } from 'util';
import { stringify } from 'querystring';

@ApiTags('users')
@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    @ApiOkResponse({type: User,  isArray: true, description: 'you will get all users'})
    @Get()
    getUsers(): User[]{
        return this.userService.findAll()
    }

    @ApiOkResponse({type: User, isArray: false})
    @Get(':id')
    getUserByID(@Param('id', ParseIntPipe) id: number): User {
        const user = this.userService.findById(id)
        if (!user){
            throw new NotFoundException();
        }
        return user
    }

    @ApiCreatedResponse({type: User})
    @Post()
    createUser(@Body() body: CreateUserDto): User{
        const user =  this.userService.createUser(body)
        return user
    }

    @ApiOkResponse({type: User, description: 'you will get a users that match with that name'})
    @ApiQuery({name: 'name', required:true})
    @Get('query')
    findByName(@Query('name') name?: string): User[]{
        return this.userService.findByName(String(name))
    }
}
