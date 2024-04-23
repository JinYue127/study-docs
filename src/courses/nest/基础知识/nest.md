---
title: Nest.JS
author: JinYue
date: 2024/04/23 10:05
categories:
 - nest快速入门
tags:
 - Nest.JS
---

# Nest.JS

[Nes.JS](https://docs.nestjs.com/)用于构建高效且可伸缩的服务端应用程序的渐进式 Node.js 框架。

一般来说，一个请求流经中间件、守卫与拦截器，然后到达管道，并最终回到拦截器中的返回路径中（从而产生响应）

## 基础知识

### 项目创建

```sh
$ npm i -g @nestjs/cli
$ nest new project-name
```

### 依赖注入

依赖注入指创建对象的过程由框架自动完成，a对象在使用b对象，b对象使用c对象，a对象只需要使用b对象，而不需要了解b对象怎么怎么样创建出c对象。

#### 高耦合代码

以下代码是没有依赖注入的情况，a对象要考虑b对象的参数，如果c对象也有参数也要考虑，这显然是高耦合低效率的编码体验。

```js
class c {
  run() {
    console.log('c object');
  }
}

class b {
  constructor(private c) {}
  run() {
    this.c.run();
  }
}

class a {
  constructor(private b) {}

  run() {
    this.b.run();
  }
}

const hd = new a(new b(new c()));
hd.run();
```

#### 依赖注入

NestJs将类定义在模块的 **providers** 属性中即声明为提供者，其他类可以在constructor构造函数中依赖注入，实现编码的解耦。

下面代码的构造函数使用依赖注入了PrismaService与JwtService服务实例。

```js
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async token({ account, id }) {
    return {
      access_token: await this.jwt.signAsync({
        username: account,
        sub: id,
      }),
    };
  }
  async register(dto: RegisterDto) {
    const user = await this.prisma.user.create({
      data: {
        account: dto.account,
        password: await argon2.hash(dto.password),
        profile: {
          create: {
            email: dto.account,
          },
        },
      },
    });
    return this.token(user);
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { account: dto.account },
    });

    // 用户密码进行比对
    const isPasswordValid = await argon2.verify(user.password, dto.password);
    // const isPasswordValid = user.password === dto.password;
    if (!isPasswordValid) {
      throw new HttpException(
        { message: '用户名或者密码错误,请重试' },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.redis.set('key', 'Redis data!');
    const redisData = await this.redis.get('key');
    // 设置token
    // return this.token(user);
    return redisData;
  }
}

```



### 生命周期

![image-20231224201223993](https://jiny127.oss-cn-hangzhou.aliyuncs.com/typora/202312242012034.png)

一般来说，nest.js请求生命周期大致如下：

1. 收到请求
2. 全局绑定的中间件
3. 模块绑定的中间件
4. 全局守卫
5. 控制层守卫
6. 路由守卫
7. 全局拦截器（控制器之前）
8. 控制器层拦截器 （控制器之前）
9. 路由拦截器 （控制器之前）
10. 全局管道
11. 控制器管道
12. 路由管道
13. 路由参数管道
14. 控制器（方法处理器）
15. 路由拦截器（请求之后）
16. 控制器拦截器 （请求之后）
17. 全局拦截器 （请求之后）
18. 异常过滤器 （路由，之后是控制器，之后是全局）
19. 服务器响应

## 提供者

在模块中使用 **providers** 声明提供者，提供者需要被注册到模块的服务容器中，才可被依赖注入。

- 提供者使用 **@Injectable()** 装饰器定义，这样系统会分析 **constructor** 进行依赖注入
- 提供者在模块的 **providers** 属性中定义，用于注册到服务容器中，用于被其他类依赖注入
- 提供者可以在自身的constructor构造函数中依赖注入其他服务提供者，需要使用 **@Injectable()** 装饰器声明该提供者
- 注册到容器的提供者，默认只对当前模块有效，即作用域为模块
- 可以使用 **exports** 导出给其他模块使用
- 提供者是单例的
- 提供者可以是任何值，而不仅仅是服务类

### 基本数据

我们可以将普通数据使用 useValue 注册到服务容器

```js
@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_NAME',
      useValue: 'NestJS学习',
    },
  ],
})
```

因为普通数据服务不是**class**，所以要使用**@Inject**进行注入

```js
import { Inject, Injectable } from '@nestjs/common'
import { Auth } from '@/auth/decorator/auth.decorator'

@Injectable()
export class AppService {
  constructor(@Inject('APP_NAME') private readonly appName: any) {}
   getAppName(): string {
     return this.appName;
   }
}

```

###  类注册

使用类将提供者注册到服务容器是最常用的方式。

```js
@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: AppService,
    },
  ],
})
```

### 动态注册

下面实现根据不同的环境创建不同的服务，首先安装 **dotenv** 扩展包，用来读取**.env**环境变量。

```sh
npm i dotenv
```

然后在模块中根据环境变量动态设置服务

```js
//读取.env 到 process.env 环境变量中
config({ path: path.join(__dirname, '../.env') });
const appService = {
  provide: AppService,
  useClass: process.env.NODE_ENV === 'development' ? AppService : HdService,
};
@Module({
  imports: [],
  controllers: [AppController],
  providers: [appService],
})
```

### 工厂函数

针对于复杂要求的**provider** ，我们可以使用 **useFactory** 工厂函数对提供者进行注册。

```js
class XjClass {
  make() {
    return 'this is XjClass Make Method';
  }
}
@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    appService,
    XjClass,
    {
      provide: 'HD',
      //依赖注入其他提供者,将做为参数传递给 useFactory 方法
      inject: [XjClass],
      useFactory: (xj: XjClass) => {
        return xj.make();
      },
    },
  ],
})
```

### 动态配置

下面使用工厂函数实现根据.env 环境变量值，加载不同配置项。

首先创建`config/development.config.ts` 与`config/production.config.ts` 配置文件

development.config.ts

```js
export const devConfig = {
  url: 'localhost',
};
```

production.config.ts

```js
export const productionConfig = {
  url: 'production.com',
};
```

```js
const configService = {
  provide: 'config',
  useFactory() {
    return process.env.NODE_ENV === 'development'
      ? devConfig
      : productionConfig;
  },
};
@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    appService,
    configService,
  ],
})
```

### 服务导出

默认情况下服务只在当前模块有效，如果服务要供其他模块使用，需要在该服务所在模块的 **exports** 属性中声明导出。

### 导出服务

下例是将 xx.module.ts 模块的服务 XXService 导出给其他模块使用。

```js
@Module({
  imports: [],
  controllers: [XxController],
  providers: [
    xxService,
  exports: [xxService],
})
```

### 导入服务

其他模块需要**imports**导入该模块后,才可以使用该模块导出的服务

```js
@Module({
  imports: [XjModule],
  controllers: [HdController],
  providers: [HdService],
})
export class HdModule {}
```

### 异步提供者

我们也可以注册异步提供者，用于对异步业务的处理。（async）

## 模块

模块是一个独立的应用单位，比如你可以将用户登录注册、配置项管理、商品定单管理分别定义为不同的模块

- 使用imports导入其他模块
- 使用providers属性向其他模块提供服务
- 使用inject 属性注入其他模块提供的服务
- 使用controllers属性声明模块的控制器，以供路由识别
- 模块是单例的
- providers定义的提供者也是单例的

## 根模块

每个应用程序至少有一个模块，即根模块。根模块是 Nest 用于构建**应用程序图**的起点。根模块在**main.ts**中定义。

如果你想让局域网用户可访问，可以在**main.ts**中指定ip地址

```js
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000, '0.0.0.0');
}
```

### 基本定义

模块是一个子程序，用于定义控制器、提供者或向其他模块开放提供者（开放模块的 API）

- 默认情况下控制器、提供者在当前模块可用，即模块作用域
- 如果向其他模块提供服务，可以将提供者定义在 **exports** 属性中，其他模块需要在 **imports** 属性中引入当前模块
- 模块是单例的，多个模块共享当前模块实例
- 模块提供者也是单例，所以模块被多个其他模块使用，那该模块的 **provider** 也是共享的

```js
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ProfileModule } from './profile/profile.module'
import configs from './config/index'
import winston from 'winston'
import { WinstonModule } from 'nest-winston'
import { AliyunModule } from './aliyun/aliyun.module'
import { UploadModule } from './upload/upload.module'
import 'winston-daily-rotate-file'
import { JwtAuthGuard } from '@/guard/jwt.guard'
import { APP_GUARD } from '@nestjs/core'
import { RedisModule } from '@nestjs-modules/ioredis'
import { ConfigEnum } from '@/enum/config.enum'
import { ViewsModule } from './views/views.module'
import { ScheduleModule } from '@nestjs/schedule'
import { ImageModule } from './image/image.module'
import { VideoModule } from './video/video.module'
import { RolesGuard } from '@/guard/role.guard'
import { UserModule } from './user/user.module'
import { RoleModule } from './role/role.module'
import { PermissionModule } from './permission/permission.module'

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
    }),
    // Redis集成
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const host = configService.get(ConfigEnum.REDIS_HOST)
        const port = configService.get(ConfigEnum.REDIS_PORT)
        const password = configService.get(ConfigEnum.REDIS_PASSWORD)
        const url = password ? `redis://${password}@${host}:${port}` : `redis://${host}:${port}`
        return {
          config: {
            url,
          },
        }
      },
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: `logs`, // 日志保存的目录
          filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
          datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
          zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
          maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
          maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
          // 记录时添加时间戳信息
          format: winston.format.combine(
            winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
            winston.format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`),
          ),
        }),
      ],
    }),
    AuthModule,
    ProfileModule,
    AliyunModule,
    UploadModule,
    ViewsModule,
    ScheduleModule.forRoot(),
    ImageModule,
    VideoModule,
    UserModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

```

### 静态模块

静态模块指模块是固定的，不需要根据不同参数改变模块的形为

下面是 **auth.module.ts** 静态模块

```js
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

然后在**app.module.ts** 根模块中使用

```js
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
```

### 动态模块

动态模块指要根据参数动态定义，比如数据库管理模块，就要根据数据库的连接配置项动态定义。

- 动态模块是运行时通过编程方式动态创建的模块
- 动态模块可以使用 **async** 定义成异步的
- 如果要定义成全局模块，可以设置 **global** 属性为**true**
- 动态模块必须返回与静态模块具有完全相同接口的对象，外加一个称为`module`的附加属性
- 动态模块除 **module** 属性外，模块选项对象的所有属性都是可选的
- 动态模块可以定义 **imports** 导入其他模块
- 定义动态模块时可以结合 **@module** 定义属性，最终两种方式会合并处理

### 全局模块

使用**@Global**装饰器定义的模块为全局模块，其他模块在使用全局模块时不需要**imports**导入该模块

- **@Global** 装饰器将模块定义为全局作用域，其他模块不需要使用 **imports** 引入该模块就可以使用
- 全局模块也需要使用 **exports** 选项向其他模块提供接口
- 不建议将模块都定义为全局模块，但像配置模块是广泛使用的，可以定义为全局模块

## 控制器

控制器负责处理传入的**请求**和向客户端返回**响应**

### 路由

路由是访问后台的途径，我们可以在控制器与控制器方法中声明路由规则。

```js
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }
  @Post('login')
  @ApiOperation({ summary: '登录' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }
}
```



### 前缀

在`man.ts`主文件中设置路由前缀，下面是设置路由以`/api/v1`为前缀，但是直接通过域名访问的`/` 根路由排除。

```js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1', {
    //排除/路由
    exclude: ['/'],
  });
  await app.listen(3000);
}
bootstrap();
```

## 项目配置

### 安装依赖

使用 @nestjs/config 扩展包

```sh
npm i @nestjs/config
```

在根模块app.module.ts中配置

```js
...
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
   	...
    ConfigModule.forRoot({
    	//全局模块
      isGlobal: true,
    }),
  ],
 	...
})
...
```

系统会自动加载**.env**中的内容

```js
DATABASE_URL="mysql://root:123456@127.0.0.1:3306/nest-demo"

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nest-demo
DB_USERNAME=root
DB_PASSWORD=123456
```

在任何的模块的服务中通过依赖注入使用

```js
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService  {
  constructor(config: ConfigService) {
		console.log(config.get('DB_HOST'))
  }
}
```

### env文件

ConfigModule模块会加载.env配置项

```js
NODE_ENV=development
DATABASE_URL="mysql://root:123456@127.0.0.1:3306/nest-demo"
```

### 模块定义

在 **app.module.ts** 模块中对**ConfigModule**进行定义

- 使用 **envFilePath** 加载多个env配置文件

- 多个env文件有同名配置项时，前面的优先级高

  

### 多文件配置

我们也可以单独对配置文件进行管理

下面在 **src/config** 目录定义两个配置文件

src/config/app.ts

```js
import { registerAs } from '@nestjs/config'
export const app = registerAs('app', () => ({
  is_dev: process.env.NODE_ENV === 'development',
  name: 'nest.js study'
}))
```

src/config/aliyun.ts

```js
import { registerAs } from '@nestjs/config'

export const aliyun = registerAs('aliyun', () => {
  return {
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    accessKeySecret: process.env.ACCESS_KEY_SECRET,
    bucket: process.env.BUCKET,
  }
})
```

### 模块声明

然后在**ConfigModule**模块中使用 **load** 属性声明加载

```js
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import config from './config/app.ts'
import aliyun from './config/aliyun.ts'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //可以加载多个配置文件
      load: [app,aliyun],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

现在可以在项目中使用点语法读取配置项了

```js
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    return this.configService.get('app.name')
  }
}
```

### 文件合并

如果你项目不复杂，也可以把上面两个配置文件，合并到一个文件中。以下是 **src/config.ts** 文件的内容

```js
export default () => ({
  app: {
    name: 'nest.js study',
    isDev: process.env.NODE_ENV=='development',
  },
  aliyun: {
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    accessKeySecret: process.env.ACCESS_KEY_SECRET,
    bucket: process.env.BUCKET,
  },
})
```

然后在模块中引入这个文件

```js
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import config from './config.ts'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

###  命名空间

使用命名空间这种方式处理配置项，也可以实现多文件管理，并会有TS类型提示。下面以创建数据库连接为例，进行说明。

#### 文件定义

首先创建配置文件 `src/config/database.config.ts`，内容如下：

```js
import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
}))
```

然后定义合并导入文件`config/database/index.ts`

```js
import databaseConfig from 'src/config/database.config'
export default [databaseConfig]
```

#### 模块声明

然后在 `app.module.ts` 中模块定义

```js
...
import config from './config'

@Module({
  imports: [ConfigModule.forRoot({ load: [...config] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

#### 使用方法

接着在`app.service.ts`中使用

- 使用 `@Inject(databaseConfig.KEY)` 注入配置项
- `ConfigType<typeof databaseConfig>` 用于定义类型，这样在使用时就有类型提示了

```js
import { ConfigType } from '@nestjs/config'
import databaseConfig from 'src/config/database.config'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  constructor(
    @Inject(databaseConfig.KEY)
    private config: ConfigType<typeof databaseConfig>,
  ) {}
  getHello(): string {
    return this.config.host
  }
}
```

## Prisma

Prisma 可以方便的管理数据表，包含数据迁移、数据填充、查询生成器等好用的功能

### 安装依赖

```sh
npm install prisma --save-dev
npm install @prisma/client
// 其他
npm i mockjs argon2
```

### 数据库连接

执行以上命令后初始化prisma

```sh
npx prisma init
```

会创建`.env`文件与`prisma`文件夹

- .env 用于定义数据库连接
- prisma用于定义模型结构与数据迁移与数据填充文件

修改`.env`文件设置mysql连接，以下连接请根据你的情况修改

```text
DATABASE_URL="mysql://root:123456@127.0.0.1:3306/nest-demo"
```

### 迁移文件

迁移文件migrate用于构建数据表结构变化，他是数据库的版本控制机制，每次表结构的修改都有单独文件记录。

### 结构定义

在 `prisman/schema.prisma` 文件内定义表结构

```js
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  account   String   @unique
  password  String
  roles     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  profile   Profile?
  image     Image?
  video     Video?
  deleted   Boolean  @default(false)
}

model Profile {
  id               Int         @id @default(autoincrement())
  avatar           String?
  firstName        String?
  lastName         String?
  mobile           String?
  email            String      @unique
  personalProfile  String?
  place            String?
  website          String?
  bilibili         String?
  littleRedBook    String?
  tikTok           String?
  instagram        String?
  userId           Int         @unique
  user             User        @relation(fields: [userId], references: [id])
  imageInfo        ImageInfo[]
  videoInfo        VideoInfo[]
  menusId          String?
  rolesId          String?
  concern          String?
  favorites        Favorites[]
  violationHistory Int?        @default(0)
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}

model Image {
  id        Int         @id @default(autoincrement())
  userId    Int         @unique
  user      User        @relation(fields: [userId], references: [id])
  imageInfo ImageInfo[]
}

model ImageInfo {
  id        Int      @id @default(autoincrement())
  Image     Image?   @relation(fields: [imageId], references: [id])
  imageId   Int
  imgUrl    String
  viewCount Int      @default(0)
  title     String
  tag       String?
  challenge String?
  isVerify  Int      @default(0)
  deleted   Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  Profile   Profile? @relation(fields: [profileId], references: [id])
  profileId Int?
}

model Video {
  id        Int         @id @default(autoincrement())
  userId    Int         @unique
  user      User        @relation(fields: [userId], references: [id])
  videoInfo VideoInfo[]
}

model VideoInfo {
  id        Int      @id @default(autoincrement())
  Video     Video    @relation(fields: [videoId], references: [id])
  videoId   Int
  videoUrl  String
  viewCount Int      @default(0)
  title     String
  tag       String?
  challenge String?
  isVerify  Int      @default(0)
  deleted   Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  Profile   Profile? @relation(fields: [profileId], references: [id])
  profileId Int?
}

model Role {
  id                   Int     @id @default(autoincrement())
  title                String
  describe             String
  permissionsId        String?
  permissionChildrenId String?
  roleName             String
}

model Permissions {
  id                 Int     @id @default(autoincrement())
  permissionName     String
  permissionMark     String
  permissionDesc     String
  PermissionChildren String?
}

model PermissionChildren {
  id             String @id
  permissionName String
  permissionMark String
  permissionDesc String
}

model Menus {
  id       Int    @id @default(autoincrement())
  menuName String
}

model Favorites {
  id        Int      @id @default(autoincrement())
  title     String?
  Profile   Profile? @relation(fields: [profileId], references: [id])
  profileId Int?
  fileId    Int?
  type      Int?
}

```

执行以下命令，将自动根据已经存在的数据库生成文件 `prisman/schema.prisma` ，而不需要向上面一样手动定义。

```sh
npx prisma db pull 
```

### 生成迁移

当创建好结构定义后，执行以下命令会在`prisma/migrations` 目录生成迁移文件，同时在数据库中创建表。

- 这时数据表也已经创建了
- 数据库中会有表 `_prisma_migrations` 记录了迁移文件

```sh
npx prisma migrate dev
```

以下命令执行动作为：

- 根据定义生成迁移文件
- 执行新的迁移文件修改数据表
- 生成 Prisma Client

### 重置数据库

我们也可以执行以下命令重置数据库

```text
npx prisma migrate reset
```

以下命令执行动作为：

- 删除数据库
- 创建数据库
- 执行所有迁移文件
- 运行 seed 数据填充

### 数据模型可视化

```
npx prisma studio
```



### 查询构造器

当执行 prisma migrate dev 后，系统会生成针对于每个表的查询构建器 `PrismaClient`。

- 查询构造器提供众多方法完成对数据的增删改查

### 定义模块

下面我们在项目代码中使用prisma，首先创建 prisma 模块。

```shell
nest g mo prisma
nest g s prisma
```

### 提供者

创建 **prisma/prisma.service.ts** 服务文件，同时将在文件中定义 日志记录 

- 当为开发环境时，终端输入查询SQL

```js
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
  	//输出查询SQL等LOG
    super(configService.get('app.isDev') ? { log: ['query', 'info', 'warn', 'error'] } : undefined)
  }
}
```

然后设置模块 **prisma/prisma.module.ts** 注册提供者，并使用exports选项向外部提供 **PrismaService** 服务

```js
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

然后在根模块 **app.module.ts** 中注册

```js
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 使用

现在其他模块也可以使用 **PrismaService** 服务了

- 因为prisma模块已经注册全局，所以其他模块不需要import

```js
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  ...
}
```

## 管道PIPE

管道pipe用于对控制器接收的数据进行验证或类型转换

### 内置管道

`Nest` 自带九个开箱即用的内置管道

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`
- `ParseFilePipe`

### 声明方式

管道可以使用以下方式声明使用

#### **控制器**

##### 控制器

```js
@UsePipes(ValidationPipe)
export class UserController{
}
```

##### 控制器方法

```js
@UsePipes(ValidationPipe)
show()
```

##### 方法参数

```js
show(@param('id',ParseIntPipe))
```

#### **模块**

一般用于声明对模块全局影响的管道如表单验证

```js
...
import { ValidatePipe } from './validate.pipe';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidatePipe,
    },
  ],
})
export class AppModule {}
```

#### **全局管道**

一般用于声明对模块全局影响的管道如表单验证

```js
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000, '0.0.0.0');
}
```

#### 类型转换

使用管道可以对请求数据进行转换

#### 常规方式

以下代码将报错，因为 **findUnique** 需要数值类型

```js
import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Get(':id')
  show(@Param('id') id) {
    return this.appService.users.findUnique({
      where: { id },
    });
  }
}
```

我们可以改良下，将id强制转为数值

```js
...
return this.appService.users.findUnique({
  where: { id: +id },
});
..
```

### 使用管道

不过使用 **ParseIntPipe** 管道操作更推荐，它是专门做数据转换的

```js
show(@Param('id', ParseIntPipe) id) {
  return this.appService.users.findUnique({
    where: { id },
  });
}
```

也可以定义响应的状态码

```js
@Get()
show(
  @Query(
    'id',
    new ParseIntPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    }),
  )
  id: number,
) {
  return this.prisma.user.findUnique({
    where: {
      id,
    },
  });
}
```

也可以使用工厂函数自定义响应，下面是自定义响应消息

```js
@Get()
show(
  @Query(
    'id',
    new ParseIntPipe({
      exceptionFactory: () => {
        throw new BadRequestException('请传递数字');
      },
    }),
  )
  id: number,
) {
  return this.prisma.user.findUnique({ where: { id } });
}
```

### 默认值管道

使用 **DefaultValuePipe** 管道用于定义默认值，下面示例表示，当没有 id 参数 时默认为1

```js
@Get()
show(@Query('id', new DefaultValuePipe(1), ParseIntPipe) id: number) {
  return this.prisma.users.findUnique({
    where: { id },
  });
}
```

### 自定义管道

如果系统提供的管道不够使用，你也可以自定义管道。

自定义管道也非常简单，使用下面命令将创建管道 **custom.pipe.ts** 用于对数据进行数值转换，即实现 **ParseIntPipe** 管道。

```sh
nest g pi custom
```

管道内容如下

```js
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CustomPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return metadata.metatype == Number ? +value : value;
  }
}
```

下面以控制器方法 `login(@Body('mobile', CustomPipe) mobile: number)` 对metadata管道参数进行说明

| 选项     | 说明                                                  |
| -------- | ----------------------------------------------------- |
| metatype | 参数类型：mobile:number ，metatype 为 number 构造函数 |
| type     | 参数类别： 如@Body、@Query                            |
| data     | 参数名称：@Body('mobile',CustomPipe)，data为mobile    |

然后就可以在控制器中使用管道了

## 表单验证

### 安装配置

表单验证使用管道操作，所以你需要对PIPE管道 有所了解。

首先创建验证需要的包 class-validator和 class-transformer

```sh
npm i class-validator class-transformer
npm i -D @nestjs/mapped-types
```

然后在 `main.ts` 中注册全局验证管道

```text
async function bootstrap() {
  ...
  app.useGlobalPipes(new ValidationPipe());
	...
}
bootstrap();
```

### 验证实现

首先创建 **dto**(Data Transfer Object) 文件 ，对请求数据进行验证规则声明。

```js
import { IsExistsRule } from '@/validate/is-exists.rule'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'

export class LoginDto {
  /**
   * 账号
   * @example '2716328193@qq.com'
   */
  @IsEmail({}, { message: '账号输入错误' })
  @IsExistsRule('user', { message: '账号不存在' })
  account: string
  /**
   * 密码
   * @example '123456'
   */
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(5, 20, { message: '请输入5~20位的密码' })
  password: string
}

```

然后创建 **validate.pipe.ts** 验证管道

```js
import { HttpException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common'

export default class ValidatePipe extends ValidationPipe {
  protected flattenValidationErrors(validationErrors: ValidationError[]): string[] {
    const messages = validationErrors.map((error) => {
      return {
        field: error.property,
        message: Object.values(error.constraints)[0],
      }
    })
    throw new HttpException(
      {
        message: messages,
      },
      HttpStatus.BAD_REQUEST,
    )
  }
}

```

#### 内置验证

**NestJs** 提供了开箱即用的验证，不需要我们自己来实现验证

首先在 **main.ts** 全局注册验证管道

```js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Validate } from './validate';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //注册验证管道
  app.useGlobalPipes(new Validate());
  await app.listen(3000);
}
bootstrap();
```

创建**user**资源用于进行验证实验

```sh
nest g res user
```

创建**dto**(Data Transfer Object) ，用于定义验证规则

```js
import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({message: '用户名不能为空'})
  name: string;
}
```

在需要验证的控制器方法中使用 **DTO**

```js
import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class AuthController {
  @Post()
  register(@Body() dto: CreateUserDto) {
    return dto;
  }
}
```

然后使用 postman 等工具对 `UserController` 的 `create` 方法行测试

你可以尝试不传递 name参数 ，将报以下错误

```js
{
    "statusCode": 400,
    "message": [
        "用户名不能为空"
    ],
    "error": "Bad Request"
}
```

类型映射

一般情况下更新与添加的**Dto**是类似的，这时可以使用 [类型映射 (opens new window)](https://docs.nestjs.com/openapi/mapped-types)优化代码，类型映射内部使用了 [@nestjs/mapped-types (opens new window)](https://github.com/nestjs/mapped-types)包。

下面是nest.js提供的常用类型映射函数。

| 类型映射         | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| PickType         | 函数通过挑出输入类型的一组属性构造一个新的类型（类）         |
| PartialType      | 函数返回一个类型（一个类）包含被设置成可选的所有输入类型的属性 |
| OmitType         | 函数通过挑出输入类型中的全部属性，然后移除一组特定的属性构造一个类型 |
| IntersectionType | 函数将两个类型合并成一个类型                                 |

下面是 **UpdateArticleDto** 继承 **CreateArticleDto**，并将所有属性设置为可选，更多使用请参考[类型映射 (opens new window)](https://docs.nestjs.cn/9/techniques?id=映射类型)文档。

下面是 **UpdateArticleDto** 继承 **CreateArticleDto**，并将所有属性设置为可选，更多使用请参考[类型映射 (opens new window)](https://docs.nestjs.cn/9/techniques?id=映射类型)文档。

```js
import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
```

下面是 **UpdateArticleDto **继承 **CreateArticleDto** 但排除 **createdAt** 属性

```js
import { OmitType } from '@nestjs/mapped-types'
import { RegisterDto } from './register.dto'

export class UpdateArticleDto extends OmitType(CreateArticleDto, ['createdAt']) {}
```

#### 验证规则

- 建议将验证规则统一保存在 **src/common/rules** 目录，并以 **.rule.ts** 结尾。
- NestJs 支持**class**与**decorator**两种定义验证规则方式

##### 表单匹配

表单匹配规则就是验证两个提交的表单值是否相同，比如验证密码与确认密码是否相同。

**确认密码检验说明**

- 如果密码字段为 **password** 则确认密码字段必须使用 **_confirmation** 为后缀即 **password_confirmation**
- 如果 **password_confirmation** 没有定义在Dto中，需要将 **ValidationPipe** 的选项 **whitelist: false** ，否则验证装饰器得不到 **password_confirmation** 值

下面介绍类与装饰器两种定义方式

##### 类方式定义

```js
import { PrismaClient } from '@prisma/client';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsConfirmedRule implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    return value == args.object[`${args.property}_confirmation`];
  }

  defaultMessage(args: ValidationArguments) {
    return '数据不匹配';
  }
}
```

在DTO中使用验证规则

```js
import { IsNotEmpty,Validate } from 'class-validator'
import { IsConfirmedRule } from 'src/rules/is.confirmed.rule'

export class RegisterDto {
  @IsNotEmpty()
  @Validate(IsConfirmedRule,{ message: '两次密码不一致' })
  password: string
}
```

##### 装饰器定义

下面是验证装饰器 **rules/is.confirm.pipe.ts** 的内容

```js
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

//表字段是否唯一
export function IsConfirmedRule(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsConfirmedRule',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return value == args.object[`${args.property}_confirmation`];
        },
      }
    });
  };
}
```

在DTO中使用验证规则

```js
import { IsNotEmpty } from 'class-validator'
import { IsConfirmedRule } from 'src/rules/is.confirmed.rule'

export class RegisterDto {
  @IsConfirmedRule({ message: '两次密码不一致' })
  @IsNotEmpty()
  password: string
}
```

##### 表值不存在

数据表中不存在该值，就验证通过。比如用户注册时，注册邮箱就不能存在。

- 因为需要查表，所以**validator** 方法要定义为异步

下面是验证装饰器内容

```js
import { PrismaClient } from '@prisma/client'
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'
//表字段是否唯一
export function IsNotExists(table: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsNotExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [table],
      options: validationOptions,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          const prisma = new PrismaClient()
          const res = await prisma[table].findFirst({
            where: {
              [args.property]: value,
            },
          })
          return !Boolean(res)
        },
      },
    })
  }
}
```

在DTO中使用验证规则

```js
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsNotExists } from 'src/rules/unique.rule';

export class CreateAuthDto {
  //使用自定义验证
  @IsNotExists('users', { message: '用户已经存在' })
  email: string;
}
```

##### 表值存在

其实就是与上面规则含义相反，指值在数据表里存在就验证通过。

比如邮箱登录时，就要求该邮箱在数据表里已经存在

```js
import { PrismaClient } from '@prisma/client'
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'
//表字段是否唯一
export function IsExists(property: { field: string; table: string }, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsNotExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [table],
      options: validationOptions,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          const prisma = new PrismaClient()
          return await prisma[table].findFirst({
            where: {
              [args.property]: value,
            },
          })
        },
      },
    })
  }
}
```

#### 自定义错误格式

我们可以对响应的消息进行自定义处理，方便前端 vue/react 的使用。

##### 定义类

下面创建 **src/filters/Validate.ts** 验证类，用于扩展系统提供的 **ValidationPipe** 验证管道。

- 对响应的错误消息添加表单名称

```js
import { HttpException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common'

export default class ValidatePipe extends ValidationPipe {
  protected flattenValidationErrors(validationErrors: ValidationError[]): string[] {
    const messages = validationErrors.map((error) => {
      return { field: error.property, message: Object.values(error.constraints)[0] }
    })

    throw new HttpException(
      {
        code: HttpStatus.BAD_REQUEST,
        messages,
        error: 'bad request',
      },
      HttpStatus.BAD_REQUEST,
    )
  }
}
```

##### 声明验证

然后在 **main.ts** 中使用我们定义的验证类

```js
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidateExceptionFilter } from './common/exceptions/validate.exception'
import Validate from './common/rules/ValidatePipe'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidatePipe())
  await app.listen(3000)
}
bootstrap()
```

#### 响应结果

如果验证失败时，将会有类似如下结果，方便前端识别是哪个表单产生了错误。

```js
{
  "code": 400,
  "messages": [
    {
      "field": "name",
      "message": "用户已经注册"
    }
  ],
  "error": "bad request"
}
```

#### 其他配置

##### 自动转换

**ValidationPipe** 可以根据对象的 **DTO** 类自动将有效数据转换为对象类型。

如果不使用自动转换时，下面的id为string

```js
@Get(':id')
index(@Param('id') id: number) {
  console.log(typeof id);
}
```

在**main.ts**中设置全局自动转换后，上面的**id****类型自动转换为 **number**

```js
const app = await NestFactory.create(AppModule);
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
);
```

##### 白名单

想过滤掉在 **Dto** 中没有声明的字段，可以在 **main.ts** 文件中对 **ValidationPipe** 管道进行配置。

```js
async function bootstrap() {
 	...
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	...
}
```

## 登陆注册

### 安装包

```sh
npm i argon2
```

然后创建资源

```text
nest g res auth
```

### 实现

`register/login.dto.ts`对字段进行验证

```js
import { IsConfirmRule } from '@/validate/is-confirm.rule'
import { IsNotExistsRule } from '@/validate/is-not-exists.rule'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'

export class RegisterDto {
  /**
   * 账号
   * @example '2716328193@qq.com'
   */
  @IsEmail({}, { message: '账号输入错误' })
  @IsNotExistsRule('user', { message: '账号已经注册' })
  account: string
  /**
   * 密码
   * @example '123456'
   */
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(5, 20, { message: '请输入5~20位的密码' })
  @IsConfirmRule({ message: '两次密码不一致' })
  password: string
  /**
   * 确认密码
   * @example '123456'
   */
  @IsNotEmpty({ message: '确认密码不能为空' })
  password_confirm: string
  roles: string
}

```

```js
import { IsExistsRule } from '@/validate/is-exists.rule'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'

export class LoginDto {
  /**
   * 账号
   * @example '2716328193@qq.com'
   */
  @IsEmail({}, { message: '账号输入错误' })
  @IsExistsRule('user', { message: '账号不存在' })
  account: string
  /**
   * 密码
   * @example '123456'
   */
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(5, 20, { message: '请输入5~20位的密码' })
  password: string
}

```

`auth.service.ts` 完善业务

```js
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { RegisterDto } from '@/auth/dto/register.dto'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/prisma/prisma.service'
import { hash, verify } from 'argon2'
import { LoginDto } from '@/auth/dto/login.dto'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async token({ account, id }) {
    return {
      access_token: await this.jwt.signAsync({
        username: account,
        sub: id,
      }),
    }
  }
  async register(dto: RegisterDto) {
    const user = await this.prisma.user.create({
      data: {
        account: dto.account,
        password: await hash(dto.password),
        roles: 'user',
        profile: {
          create: {
            email: dto.account,
            menusId: '0',
            rolesId: '5',
          },
        },
        image: {
          create: {},
        },
        video: {
          create: {},
        },
      },
    })
    return this.token(user)
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { account: dto.account },
    })

    // 用户密码进行比对
    const isPasswordValid = await verify(user.password, dto.password)
    if (!isPasswordValid) {
      throw new HttpException({ message: '用户名或者密码错误,请重试' }, HttpStatus.BAD_REQUEST)
    }
    // 设置token
    return this.token(user)
  }
  async adminLogin(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { account: dto.account },
    })

    // 用户密码进行比对
    const isPasswordValid = await verify(user.password, dto.password)
    if (!isPasswordValid) {
      throw new HttpException({ message: '用户名或者密码错误,请重试' }, HttpStatus.BAD_REQUEST)
    }
    // 设置token
    return this.token(user)
  }
}

```

控制器`auth.controller.ts`中使用

```js
import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from '@/auth/dto/register.dto'
import { LoginDto } from '@/auth/dto/login.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from '@/utils'
import { Roles } from '@/auth/decorator/roles.decorator'
import { Role } from '@/enum/role.enum'

@ApiTags('登陆注册')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }
  @Post('login')
  @ApiOperation({ summary: '登录' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }
  @Post('admin/login')
  // @Roles(Role.SuperAdmin, Role.Admin, Role.ImageAuditor, Role.VideoAuditor)
  // @Roles(Role.SuperAdmin)
  @ApiOperation({ summary: '后台登录' })
  adminLogin(@Body() dto: LoginDto) {
    return this.authService.adminLogin(dto)
  }
}

```

## 身份认证

### 基础知识

身份验证过程是，客户端将首先使用用户名和密码进行身份验证。经过身份验证后，服务器将发出一个 JWT。然后在请求的头信息中携带 JWT 来标识身份。

我们需要完成以下几步

- 对用户进行身份验证
- 然后，我们将发给用户TOKEN
- 最后，我们将创建一个受保护的路由，用于检查请求上的有效 TOKEN

### 安装配置

```
npm i @nestjs/passport passport passport-local @nestjs/jwt passport-jwt
npm i -D @types/passport-local @types/passport-jwt
```

下面在auth.module.ts模块中定义Jwt模块

```js
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConfigEnum } from '@/enum/config.enum'
import { JwtStrategy } from './auth.strategy'
import { PrismaModule } from '@/prisma/prisma.module'
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>(ConfigEnum.JWT_SECRET),
          signOptions: {
            expiresIn: configService.get<string>(ConfigEnum.JWT_EXPIRES_IN),
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}

```

### 获取令牌

```js
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async token({ account, id }) {
    return {
      access_token: await this.jwt.signAsync({
        username: account,
        sub: id,
      }),
    }
  }
  async register(dto: RegisterDto) {
    const user = await this.prisma.user.create({
      data: {
        account: dto.account,
        password: await hash(dto.password),
        roles: 'user',
        profile: {
          create: {
            email: dto.account,
            menusId: '0',
            rolesId: '5',
          },
        },
        image: {
          create: {},
        },
        video: {
          create: {},
        },
      },
    })
    return this.token(user)
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { account: dto.account },
    })

    // 用户密码进行比对
    const isPasswordValid = await verify(user.password, dto.password)
    if (!isPasswordValid) {
      throw new HttpException({ message: '用户名或者密码错误,请重试' }, HttpStatus.BAD_REQUEST)
    }
    // 设置token
    return this.token(user)
  }
  async adminLogin(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { account: dto.account },
    })

    // 用户密码进行比对
    const isPasswordValid = await verify(user.password, dto.password)
    if (!isPasswordValid) {
      throw new HttpException({ message: '用户名或者密码错误,请重试' }, HttpStatus.BAD_REQUEST)
    }
    // 设置token
    return this.token(user)
  }
}
```

### 策略编写

策略是实现JWT的验证逻辑，策略就像你家小区的门禁验证规则，对你的身份进行查验 。

我们可以编写多个策略，比如根据用户名与密码的验证策略，或根据TOKEN的验证策略。

下面定义 **jwt.strategy.ts** 文件，定义使用 **token** 进行身份验证的JWT策略。

```js
import { PrismaService } from '@/prisma/prisma.service'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigEnum } from '@/enum/config.enum'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService, private prisma: PrismaService) {
    super({
      //解析用户提交的Bearer Token header数据
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //加密码的 secret
      secretOrKey: configService.get(ConfigEnum.JWT_SECRET),
    })
  }

  // 验证通过后结果用户资料
  async validate({ sub: id }) {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }
}

```

然后在 **auth.module.ts** 中注册为提供者

```js
import { JwtStrategy } from './strategy';
...
@Module({
  ...
  controllers: [AuthController],
  //注入容器
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

### 验证使用

现在创建个模块auth用于实验token的验证

```text
nest g res user
```

只保留控制器中的 `findOne` 方法

```js
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  //AuthGuard守卫使用jwt策略进行验证
  @UseGuards(AuthGuard('jwt'))
  //jwt.strategy.ts 中 validate结果会保存到req请求数据中
  findOne(@Req() req: Request) {
    return req.user;
  }
}
```

### 简化操作

我们将验证的 **@UseGuards(AuthGuard('jwt'))** 代码通过 [装饰器 (opens new window)](https://docs.nestjs.cn/9/customdecorators)进行简化操作。

模块可能有多个装饰器所以创建装饰器目录 `auth/`结构如下

```js
src/decorator
├── auth.decorator.ts 验证装饰器
└── user.decorator.ts 用户资料装饰器
```

#### 装饰器聚合

我们将在控制器方法中使用的 **@UseGuards(JwtGuard)** 验证简化为 **@Auth()**，这需要定义Auth装饰器完成。

装饰器 **decorator/auth.decorator.ts** 内容如下，使用 [装饰器聚合 (opens new window)](https://docs.nestjs.cn/9/customdecorators?id=装饰器聚合)功能完成。

你可以把[装饰器聚合 (opens new window)](https://docs.nestjs.cn/9/customdecorators?id=装饰器聚合)理解为应用多个装饰器。

```js
import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard('jwt')))
}

```

现在在控制器直接使用 **@Auth()** 装饰器

```js
import { Auth } from 'src/auth/decorator';

export class UserController {
	...
  @Auth()
  findOne() {
  }
}
```

#### 用户装饰器

**decorator/user.decorator.ts** 用于获取request中的user用户信息，user来源于上面讲解的策略。

```js
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user
})

```

然后在 **user.controller.ts** 等控制器中使用

```text
import { Auth,User } from 'src/auth/decorator';
...

@Controller('user')
export class UserController {
  ...
  @Auth()
  findOne(@User() user: users) {
    return user;
  }
}
```

### 守卫定义

守卫是根据选择的策略对身份进行验证，保护路由访问。上面例子中一直在使用`AuthGuard`守卫，我们也可以自定义守卫。

根据运行时出现的某些条件（例如权限，角色，访问控制列表等）来确定给定的请求是否由路由处理程序处理，这通常称为授权。

![image-20231225173042918](https://jiny127.oss-cn-hangzhou.aliyuncs.com/typora/image-20231225173042918.png)

#### 验证

创建 **jwt.guard.ts** 守卫，验证接口是否需要token。

```js
import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '@/utils'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }
}

```

创建 **role.guard.ts** 守卫，通过对角色的验证来检测用户是否有对控制器方法的访问权限

创建 **auth/enum.ts** 文件，用于定义角色类型

```text
export enum Role {
  ADMIN = 'admin',
}
```

下面创建 **auth/decorators/auth.decorator.ts** 聚合装饰器

- 通过设置元信息Roles 来声明该方法可访问的角色

```js
import { SetMetadata } from '@nestjs/common'
import { Role } from '@/enum/role.enum'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)

```

然后创建 **auth/guards/roles.guard.ts** 守卫文件，用于对角色进行验证。

使用 **reflector** 反射获取上面在控制器方法中定义的角色数据

- context.getHandler 当前请求方法
- context.getClass 当前控制器

```js
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '@/auth/decorator/roles.decorator'
import { Role } from '@/enum/role.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()
    const roles = user.roles.split(',')
    return requiredRoles.some((role) => roles.includes(role))
  }
}

```

然后在控制器中使用

```js
import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from '@/auth/dto/register.dto'
import { LoginDto } from '@/auth/dto/login.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from '@/utils'
import { Roles } from '@/auth/decorator/roles.decorator'
import { Role } from '@/enum/role.enum'

@ApiTags('登陆注册')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }
  @Post('login')
  @ApiOperation({ summary: '登录' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }
  @Post('admin/login')
  // @Roles(Role.SuperAdmin, Role.Admin, Role.ImageAuditor, Role.VideoAuditor)
  // @Roles(Role.SuperAdmin)
  @ApiOperation({ summary: '后台登录' })
  adminLogin(@Body() dto: LoginDto) {
    return this.authService.adminLogin(dto)
  }
}

```

## CRUD

一些使用prisma例子

### 控制器

```js
import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common'
import { ImageService } from './image.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ImageListDto } from '@/image/dto/image-list.dto'
import { CurrentUser } from '@/auth/decorator/user.decorator'
import { User } from '@prisma/client'
import { PaginationDto } from '@/image/dto/pagination.dto'
import { SearchHintDto } from '@/image/dto/search-hint.dto'
import { SearchOptionDto } from '@/image/dto/search-option.dto'
@ApiTags('图片')
@ApiBearerAuth()
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('list')
  @ApiOperation({ summary: '前台获取图片列表' })
  findAllImage(@Body() imageListDto: ImageListDto, @CurrentUser() user: User) {
    return this.imageService.findAll(imageListDto, user)
  }
  @Get(':id')
  @ApiOperation({ summary: '根据图片id获取图片信息' })
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id)
  }
  @Post('admin/list')
  @ApiOperation({ summary: '后台获取审核图片列表' })
  findAll(@Body() paginationDto: PaginationDto) {
    return this.imageService.findAllImage(paginationDto)
  }
  @Delete('admin/delete/:id')
  @ApiOperation({ summary: '删除图片' })
  deleteImage(@Param('id') id: string) {
    return this.imageService.deleteImage(+id)
  }
  @Patch('/admin/machine-review-images/:id')
  @ApiOperation({ summary: '机器审核图片' })
  machineReviewPictures(@Param('id') id: string) {
    return this.imageService.machineReviewPictures(+id)
  }
  @Patch('collect/:fileId/:type/:cancel')
  @ApiOperation({ summary: '收藏文件' })
  collectionImages(
    @Param('fileId') fileId: string,
    @CurrentUser() user: User,
    @Param('type') type: string,
    @Param('cancel') cancel: string,
  ) {
    return this.imageService.collectionFile(+fileId, user, +type, +cancel)
  }
  @Get('user-file-list/:filedType/:type/:userId')
  @ApiOperation({ summary: '获取图片和视频' })
  getImagesByUserId(
    @CurrentUser() user: User,
    @Param('filedType') filedType: string,
    @Param('type') type: string,
    @Param('userId') userId: string,
  ) {
    return this.imageService.getFilesByUserId(user, +filedType, +type, +userId)
  }
  @Get('user-concern-list/:filedType/:userId')
  @ApiOperation({ summary: '获取收藏的图片和视频' })
  getFavoriteFilesByUserId(
    @CurrentUser() user: User,
    @Param('filedType') filedType: string,
    @Param('userId') userId: string,
  ) {
    return this.imageService.getFavoriteFilesByUserId(user, +filedType, +userId)
  }
  @Post('hint')
  @ApiOperation({ summary: '获取搜索提示' })
  getSearchHint(@Body() hint: SearchHintDto) {
    return this.imageService.getSearchHint(hint)
  }
  @Get('popular/theme')
  @ApiOperation({ summary: '获取人气主题' })
  getPopularTag() {
    return this.imageService.getPopularTheme()
  }
  @Post('search')
  @ApiOperation({ summary: '搜索文件' })
  getSearchFile(@Body() searchOption: SearchOptionDto) {
    return this.imageService.getSearchFile(searchOption)
  }
}

```

### 服务

```js
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ImageListDto } from '@/image/dto/image-list.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { User } from '@prisma/client'
import { PaginationDto } from '@/image/dto/pagination.dto'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { ConfigEnum } from '@/enum/config.enum'
import { lastValueFrom } from 'rxjs'
import { map } from 'rxjs/operators'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { SearchHintDto } from '@/image/dto/search-hint.dto'
import { SearchOptionDto } from '@/image/dto/search-option.dto'

@Injectable()
export class ImageService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async findAll(imageListDto: ImageListDto, _user_: User) {
    const image = await this.prisma.image.findUnique({
      where: {
        userId: _user_.id,
      },
      select: {
        id: true,
      },
    })
    const where: any = {
      imageId: {
        not: image.id,
      },
      isVerify: 1,
      deleted: false,
    }
    const orderBy: any = {}
    const concernResult = []
    if (imageListDto.type === '0') {
      orderBy.viewCount = 'desc'
    } else if (imageListDto.type === '1') {
      orderBy.createdAt = 'desc'
    } else if (imageListDto.type === '2') {
      const concern = await this.prisma.profile.findUnique({
        where: {
          userId: _user_.id,
        },
        select: {
          concern: true,
        },
      })
      if (concern.concern) {
        const concernId = concern.concern.split(',')
        for (let i = 0; i < concernId.length; i++) {
          const image = await this.prisma.image.findUnique({
            where: {
              userId: +concernId[i],
            },
            select: {
              userId: true,
              imageInfo: {
                where: {
                  isVerify: 1,
                  deleted: false,
                },
              },
            },
          })
          const profile = await this.prisma.profile.findUnique({
            where: {
              userId: image.userId,
            },
            select: {
              avatar: true,
              firstName: true,
            },
          })
          for (let j = 0; j < image.imageInfo.length; j++) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            image.imageInfo[j].Profile = profile
          }
          concernResult.push(...image.imageInfo)
        }
      }
    } else {
      throw new HttpException(
        {
          message: 'type参数不正确',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    const result = await this.prisma.imageInfo.findMany({
      where,
      include: {
        Profile: {
          select: {
            firstName: true,
            avatar: true,
            userId: true,
          },
        },
      },
      skip: (imageListDto.page - 1) * 10,
      take: 10,
      orderBy,
    })
    const total = await this.prisma.imageInfo.count({
      where,
    })
    return { list: imageListDto.type == '2' ? concernResult : result, total }
  }
  findOne(id: number) {
    return this.prisma.imageInfo.findFirst({
      where: {
        id,
      },
      include: {
        Profile: {
          select: {
            firstName: true,
            avatar: true,
          },
        },
      },
    })
  }
  async findAllImage(paginationDto: PaginationDto) {
    const total = await this.prisma.imageInfo.count({
      where: {
        deleted: false,
      },
    })
    const list = await this.prisma.imageInfo.findMany({
      skip: (paginationDto.page - 1) * paginationDto.size,
      take: paginationDto.size,
      orderBy: { isVerify: 'asc' },
    })
    return { list, total, page: paginationDto.page, size: paginationDto.size }
  }
  async deleteImage(id: number) {
    const imageInfo = await this.prisma.imageInfo.findUnique({
      where: { id },
      select: { isVerify: true },
    })
    if (imageInfo.isVerify !== 2) {
      return new HttpException('审核失败后才能删除', HttpStatus.FORBIDDEN)
    }
    await this.prisma.imageInfo.update({
      where: { id },
      data: {
        deleted: true,
      },
    })
    return { message: '删除图片成功', status: 200 }
  }
  async machineReviewPictures(id: number) {
    const isVerify = await this.prisma.imageInfo.findUnique({
      where: { id },
      select: {
        isVerify: true,
      },
    })
    if (isVerify.isVerify !== 0) {
      return '已审核过'
    }
    const isOverdue = await this.redis.exists('baiduyun_token')
    let token = ''
    if (isOverdue) {
      token = await this.redis.get('baiduyun_token')
    } else {
      await this.getToken()
      token = await this.redis.get('baiduyun_token')
    }
    const image = await this.prisma.imageInfo.findUnique({
      where: { id },
      select: {
        imgUrl: true,
        profileId: true,
      },
    })
    const result = await lastValueFrom(
      this.httpService
        .post(
          'https://aip.baidubce.com/rest/2.0/solution/v1/img_censor/v2/user_defined',
          { imgUrl: image.imgUrl },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: { access_token: token },
          },
        )
        .pipe(
          map((response) => {
            return response.data
          }),
        ),
    )
    if (result.conclusionType === 1) {
      await this.prisma.imageInfo.update({
        where: { id },
        data: {
          isVerify: 1,
        },
      })
    } else {
      await this.prisma.imageInfo.update({
        where: { id },
        data: {
          isVerify: 2,
        },
      })
      await this.prisma.profile.update({
        where: { id: image.profileId },
        data: {
          violationHistory: {
            increment: 1,
          },
        },
      })
    }
    return '审核成功'
  }
  async collectionFile(fileId: number, _user_: User, type: number, cancel: number) {
    const profileId = await this.prisma.profile.findUnique({
      where: {
        userId: _user_.id,
      },
      select: {
        id: true,
      },
    })
    const favoritesId = await this.prisma.favorites.findFirst({
      where: {
        fileId,
        profileId: profileId.id,
      },
      select: {
        id: true,
      },
    })
    if (cancel === 0 && !favoritesId) {
      await this.prisma.favorites.create({
        data: {
          fileId,
          profileId: profileId.id,
          type,
        },
      })
      return '收藏成功'
    } else if (cancel === 1) {
      await this.prisma.favorites.delete({
        where: {
          id: favoritesId.id,
        },
      })
      return '取消收藏成功'
    }
  }
  async getFilesByUserId(_user_: User, filedType: number, type: number, userId: number) {
    const orderBy = {}
    if (type === 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      orderBy.viewCount = 'desc'
    } else if (type === 1) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      orderBy.createdAt = 'desc'
    }
    if (filedType === 0) {
      const result = await this.prisma.user.findUnique({
        where: {
          id: userId === 0 ? _user_.id : userId,
        },
        select: {
          image: {
            select: {
              imageInfo: {
                where: {
                  deleted: false,
                  isVerify: 1,
                },
                orderBy,
              },
            },
          },
          profile: true,
        },
      })
      return { list: result.image.imageInfo, profile: result.profile }
    }
    if (filedType === 1) {
      const result = await this.prisma.user.findUnique({
        where: {
          id: userId === 0 ? _user_.id : userId,
        },
        select: {
          video: {
            select: {
              videoInfo: {
                where: {
                  deleted: false,
                  isVerify: 1,
                },
                orderBy,
              },
            },
          },
          profile: true,
        },
      })
      return { list: result.video.videoInfo, profile: result.profile }
    }
  }
  async getFavoriteFilesByUserId(_user_: User, filedType: number, userId: number) {
    const favorites = await this.prisma.profile.findUnique({
      where: {
        userId: userId === 0 ? _user_.id : userId,
      },
      select: {
        favorites: {
          where: {
            type: filedType,
          },
        },
      },
    })
    const result = []
    for (let i = 0; i < favorites.favorites.length; i++) {
      const fileInfo =
        filedType === 0
          ? await this.prisma.imageInfo.findFirst({
              where: {
                id: +favorites.favorites[i].fileId,
                deleted: false,
                isVerify: 1,
              },
            })
          : await this.prisma.videoInfo.findFirst({
              where: {
                id: +favorites.favorites[i].fileId,
                deleted: false,
                isVerify: 1,
              },
            })
      const profile = await this.prisma.profile.findUnique({
        where: {
          id: +favorites.favorites[i].profileId,
        },
      })
      result.push({ ...fileInfo, profile })
    }
    return result
  }
  async getSearchHint(hint: SearchHintDto) {
    const result = await this.prisma.imageInfo.findMany({
      where: {
        title: {
          startsWith: hint.hint,
        },
        deleted: false,
        isVerify: 1,
      },
      take: 5,
    })
    return result.map((item) => {
      return item.title
    })
  }
  async getPopularTheme() {
    const tagGroupBy = await this.prisma.imageInfo.groupBy({
      by: ['tag'],
      _sum: {
        viewCount: true,
      },
      orderBy: {
        _sum: {
          viewCount: 'desc',
        },
      },
      take: 8,
    })
    const result = []
    for (let i = 0; i < tagGroupBy.length; i++) {
      const image = await this.prisma.imageInfo.findFirst({
        where: {
          tag: tagGroupBy[i].tag,
        },
        select: {
          imgUrl: true,
        },
      })
      result.push({ tag: tagGroupBy[i].tag, url: image.imgUrl })
    }
    return result
  }
  async getSearchFile(searchOption: SearchOptionDto) {
    const list = []
    let total =
      searchOption.type === '0'
        ? await this.prisma.imageInfo.count({
            where: {
              isVerify: 1,
              deleted: false,
              title: {
                startsWith: searchOption.searchText,
              },
            },
          })
        : await this.prisma.videoInfo.count({
            where: {
              isVerify: 1,
              deleted: false,
              title: {
                startsWith: searchOption.searchText,
              },
            },
          })
    if (searchOption.type === '0') {
      const image = await this.prisma.imageInfo.findMany({
        where: {
          isVerify: 1,
          deleted: false,
          title: {
            startsWith: searchOption.searchText,
          },
        },
        skip: (searchOption.page - 1) * searchOption.size,
        take: searchOption.size,
      })
      for (let i = 0; i < image.length; i++) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        image[i].profile = await this.prisma.profile.findUnique({
          where: {
            id: image[i].profileId,
          },
        })
        list.push(image[i])
      }
    } else if (searchOption.type === '1') {
      const video = await this.prisma.videoInfo.findMany({
        where: {
          isVerify: 1,
          deleted: false,
          title: {
            startsWith: searchOption.searchText,
          },
        },
        skip: (searchOption.page - 1) * searchOption.size,
        take: searchOption.size,
      })
      for (let i = 0; i < video.length; i++) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        video[i].profile = await this.prisma.profile.findUnique({
          where: {
            id: video[i].profileId,
          },
        })
        list.push(video[i])
      }
    } else if (searchOption.type === '2') {
      const user = await this.prisma.user.findMany({
        select: {
          profile: true,
        },
        where: {
          profile: {
            firstName: {
              startsWith: searchOption.searchText,
            },
          },
        },
      })
      for (let i = 0; i < user.length; i++) {
        const image = await this.prisma.imageInfo.findMany({
          where: {
            profileId: user[i].profile.id,
          },
        })
        for (let j = 0; j < image.length; j++) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          image[j].profile = user[i].profile
          list.push(image[j])
        }
      }
      total = list.length
    }
    return { total, list }
  }
}

```

##  拦截器

拦截器是在请求前后对数据进行拦截处理。

### 定义拦截器

下面是使用拦截器对所有响应数据以data属性进行包裹。

```js
import { CallHandler, ExecutionContext, Injectable, LoggerService, NestInterceptor } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { getReqMainInfo } from '@/utils'
import { Request } from 'express'
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp()
    const req = ctx.getRequest<Request>()
    return next.handle().pipe(
      map((data) => {
        this.logger.log(JSON.stringify({ data, ...getReqMainInfo(req) }))
        return {
          data,
          success: true,
          code: context.switchToHttp().getResponse().statusCode,
          message: '请求成功',
        }
      }),
    )
  }
}

```

### 注册拦截器

我们可以在控制器、模块、全局注册拦截器。

#### 控制器中定义拦截器

```js
@UseInterceptors(new TransformInterceptor())
export class CatsController {}
```

#### 模块定义拦截器

```js
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
```

#### 全局注册拦截器

```js
const app = await NestFactory.create(ApplicationModule);
  app.useGlobalInterceptors(new TransformInterceptor(new Logger()))
```

## 响应

序列化类（序列化）用于对返回给客户端的数据进行转换处理，比如控制用户密码字段不返回。序列化使用 [class-transformer (opens new window)](https://github.com/typestack/class-transformer)扩展包完成

### 声明定义

序列化使用拦截器进行处理，我们可以在全局，控制器，方法等处进行定义。

### 全局定义

修改 **main.ts** 主文件

```js
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
 	...
 	//全局定义序列化拦截器
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  await app.listen(3000)
}
bootstrap()
```

### 控制器

也可以在控制器中声明序列化

```js
import { Body, ClassSerializerInterceptor, Controller, SerializeOptions, UseInterceptors } from '@nestjs/common'
...

@Controller('article')
@UseInterceptors(ClassSerializerInterceptor)

export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
	...
}
```

### 方法

也支持在方法中定义序列化

```js
import { Body, ClassSerializerInterceptor, Controller, SerializeOptions, UseInterceptors } from '@nestjs/common'
...

@UseInterceptors(ClassSerializerInterceptor)
@Get(':id')
async findOne(@Param('id') id: string) {
	...
}
```

### 过滤选项

我们使用 **@SerializeOptions()** 对响进行配置，然后在响应类中对属性进行细节定义。

| 选项            | 说明                                           | 示例                                                         |
| --------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| strategy        | exposeAll:包含所有属性 excludeAll:排除所有属性 | @SerializeOptions({ strategy: 'exposeAll' })                 |
| excludePrefixes | 排除某个前缀的属性                             | @SerializeOptions({ strategy: 'exposeAll',excludePrefixes: ['_'] }) |

下面是在控制器中对过滤选项的定义

```js
import { Body, ClassSerializerInterceptor, Controller, SerializeOptions, UseInterceptors } from '@nestjs/common'
...

@Controller('article')
@UseInterceptors(ClassSerializerInterceptor)
//定义序列化选项
@SerializeOptions({ strategy: 'exposeAll' })

export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  ...
}
```

### 异常过滤器

使用 **filter** 过滤器可以对异常进行自定义处理。

```js
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from '@nestjs/common'
import { getReqMainInfo } from '@/utils'
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // 如果有日志服务，可以在constructor,中挂载logger处理函数
  constructor(private readonly logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp() // 获取请求上下文
    const req = ctx.getRequest() // 获取请求上下文中的request对象
    const res = ctx.getResponse() // 获取请求上下文中的response对象
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR // 获取异常状态码
    const response = exception.getResponse()
    let message = exception.message || (status >= 500 ? 'Service Error' : 'Client Error')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (Object.prototype.toString.call(response) === '[object Object]' && response.message) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message = response.message
    }
    const nowTime = new Date().toString()

    const errorResponse = {
      data: {},
      message,
      code: status,
      date: nowTime,
      path: req.url,
    }
    // 将异常记录到logger中
    this.logger.error(JSON.stringify({ message, ...getReqMainInfo(req) }))
    // 设置返回的状态码， 请求头，发送错误信息
    res.status(status)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(errorResponse)
  }
}

```

## 文件上传

```
npm i multer
npm i -D @types/multer
```

### 阿里云oss

controllor

```js
import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { UploadService } from './upload.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FileUploadDto } from '@/upload/dto/FileUpload.dto'
import { User } from '@prisma/client'
import { CurrentUser } from '@/auth/decorator/user.decorator'
@ApiTags('上传')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('image')
  @ApiOperation({ summary: '上传图片' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传图片',
    type: FileUploadDto,
  })
  @UseInterceptors(FilesInterceptor('files'))
  uploadFileImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('fileInfo') fileInfo,
    @CurrentUser() user: User,
  ) {
    let newFileInfo = []
    if (files.length === 1) {
      newFileInfo.push(JSON.parse(fileInfo))
    } else {
      newFileInfo = fileInfo.map((item) => {
        return JSON.parse(item)
      })
    }
    this.uploadService.uploadImage(files, newFileInfo, user.id)
  }
  @Post('video')
  @ApiOperation({ summary: '上传视频' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传视频',
    type: FileUploadDto,
  })
  @UseInterceptors(FilesInterceptor('files'))
  uploadFileVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('fileInfo') fileInfo,
    @CurrentUser() user: User,
  ) {
    let newFileInfo = []
    if (files.length === 1) {
      newFileInfo.push(JSON.parse(fileInfo))
    } else {
      newFileInfo = fileInfo.map((item) => {
        return JSON.parse(item)
      })
    }
    this.uploadService.uploadVideo(files, newFileInfo, user.id)
  }
}

```

service

```js
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AliyunService } from '@/aliyun/aliyun.service'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateImageFileDto } from '@/upload/dto/CreateImageFile.dto'
import { CreateVideoFileDto } from '@/upload/dto/CreateVideoFile.dto'

@Injectable()
export class UploadService {
  constructor(private aliyunService: AliyunService, private prisma: PrismaService) {}
  uploadImage(files, newFileInfo, _userId_: any) {
    const allPromise = []
    files.forEach((item) => {
      allPromise.push(this.aliyunService.putBuffer(item.originalname, item.buffer))
    })
    Promise.all(allPromise)
      .then(async (res) => {
        const profile = await this.prisma.profile.findUnique({
          where: { userId: _userId_ },
          select: { id: true },
        })
        const createImageFileDto: CreateImageFileDto[] = []
        const image = await this.prisma.image.findUnique({
          where: { userId: _userId_ },
          select: {
            id: true,
          },
        })
        for (let i = 0; i < newFileInfo.length; i++) {
          createImageFileDto.push({
            imgUrl: res[i].url,
            title: newFileInfo[i].title,
            tag: newFileInfo[i].tag,
            challenge: newFileInfo[i].challenge,
            imageId: image.id,
            profileId: profile.id,
          })
        }
        await this.prisma.imageInfo.createMany({
          data: createImageFileDto,
        })
      })
      .catch((err) => {
        throw new HttpException({ message: err }, HttpStatus.BAD_REQUEST)
      })
  }
  uploadVideo(files, newFileInfo, _userId_: any) {
    const allPromise = []
    files.forEach((item) => {
      allPromise.push(this.aliyunService.putBuffer(item.originalname, item.buffer))
    })
    Promise.all(allPromise)
      .then(async (res) => {
        const createImageFileDto: CreateVideoFileDto[] = []
        const video = await this.prisma.video.findUnique({
          where: { userId: _userId_ },
          select: {
            id: true,
          },
        })
        const profile = await this.prisma.profile.findUnique({
          where: { userId: _userId_ },
          select: { id: true },
        })
        for (let i = 0; i < newFileInfo.length; i++) {
          createImageFileDto.push({
            videoUrl: res[i].url,
            title: newFileInfo[i].title,
            tag: newFileInfo[i].tag,
            challenge: newFileInfo[i].challenge,
            videoId: video.id,
            profileId: profile.id,
          })
        }
        await this.prisma.videoInfo.createMany({
          data: createImageFileDto,
        })
      })
      .catch((err) => {
        throw new HttpException({ message: err }, HttpStatus.BAD_REQUEST)
      })
  }
}
```

### 本地

#### 模块定义

上传配置可以放在控制器方法，也可以放在模块中，下面是在模块中定义。

```js
import { Global, Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { UploadController } from './upload.controller'
@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory() {
        return {
          storage: diskStorage({
            //文件储存位置
            destination: 'uploads',
            //文件名定制
            filename: (req, file, callback) => {
              const path = Date.now() + '-' + Math.round(Math.random() * 1e10) + extname(file.originalname)
              callback(null, path)
            },
          }),
        }
      },
    }),
  ],
  controllers: [UploadController],
})
export class CommonModule {}
```

#### 基本使用

现在我们在控制器中体验文件上传

### 上传处理

下面在控制器使用

```js
import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  image(@UploadedFile() file: Express.Multer.File) {
    return file
  }
}
```

下面使用postman等测试工作来测试上传是否成功，如果成功会返回以下结果。

- 下面数据包含在data中是因为使用拦截器处理，请查看拦截器章节了解

```js
{
  "fieldname": "file",
  "originalname": "xj-small.png",
  "encoding": "7bit",
  "mimetype": "image/png",
  "destination": "uploads",
  "filename": "1658807155785-7305320730.png",
  "path": "uploads/1658807155785-7305320730.png",
  "size": 40442
}
```

#### 类型校验

下面示例只允许上传图片文件

```js
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) {
        if (file.mimetype.includes('image')) {
          callback(new UnsupportedMediaTypeException('文件类型错误'), false)
        } else {
          callback(null, true)
        }
      },
    }),
  )
  ...
}
```

#### 优化代码

如果上传分图片/文档等不同类型的上传处理，使用上面的方式需要在控制器的不同方法定义重复度很高的代码 。下面我们来简化这个过程。

##### 装饰器聚合

我们将 **@UseInterceptors(FileInterceptor('file'))** 通过装饰器聚合来简化代码，下面在 **./upload.ts** 文件中定义。

```js
import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

export function upload(fieldName = 'file', options: MulterOptions = {}) {
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName, options)))
}
```

现在在控制器中就可以简化操作了

```js
import { Controller, Post, UploadedFile } from '@nestjs/common'
import { UploadDecorator } from './decorator/upload.decorator'

@Controller('upload')
export class UploadController {
  @Post()
  @upload('file', {
      fileFilter(req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) {
        if (file.mimetype.includes('image')) {
          callback(new UnsupportedMediaTypeException('文件类型错误'), false)
        } else {
          callback(null, true)
        }
  })
  upload(@UploadedFile() file: Express.Multer.File) {
    return file
  }
} 
```

##### 抽离验证功能

下面对上传的文件类型验证进行抽离，修改 **./upload.ts** 定义 **fileMimetypeFilter** 函数用于对上传类型进行验证。

```js
export function fileMimetypeFilter(...mimes: string[]) {
  return (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (mimes.some((mime) => file.mimetype.includes(mime))) {
      callback(null, true)
    } else {
      callback(new UnsupportedMediaTypeException('文件上传类型错误'), false)
    }
  }
}
```

现在可以在控制器中对上传文件进行验证了

```js
import { Controller, Post, UploadedFile } from '@nestjs/common'
import { UploadDecorator,fileMimetypeFilter} from './upload'

@Controller('upload')
export class UploadController {
  @Post()
  @UploadDecorator('file', {fileFilter: fileMimetypeFilter('image')})
  upload(@UploadedFile() file: Express.Multer.File) {
    return file
  }
} 
```

##### 最终封装

经过上面的学习，现在应该对nest.js上传已经掌握了，下面我们进行整合，使用上传使用变得更方便 。

##### 功能整合

下面我们修改 **./upload.ts** 对图片上传与文档上传定义

```js
import { applyDecorators, UnsupportedMediaTypeException, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

//上传类型验证
export function filterFilter(type: string) {
  return (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (!file.mimetype.includes(type)) {
      callback(new UnsupportedMediaTypeException('文件类型错误'), false)
    } else {
      callback(null, true)
    }
  }
}

//文件上传
export function Upload(field = 'file', options: MulterOptions) {
  return applyDecorators(UseInterceptors(FileInterceptor(field, options)))
}

//图片上传
export function Image(field = 'file') {
  return Upload(field, {
    //上传文件大小限制
    limits: Math.pow(1024, 2) * 2,
    fileFilter: filterFilter('image'),
  } as MulterOptions)
}

//文档上传
export function Document(field = 'file') {
  return Upload(field, {
    //上传文件大小限制
    limits: Math.pow(1024, 2) * 5,
    fileFilter: filterFilter('document'),
  } as MulterOptions)
}
```

##### 实际使用

现在可以在控制器中方便的使用上传了

```js
import { Controller, Post, UploadedFile } from '@nestjs/common'
import { image } from './upload'

@Controller('upload')
export class UploadController {
  @Post('image')
  @Image()
  image(@UploadedFile() file: Express.Multer.File) {
    return file
  }
}
```

##### 文件访问

图片虽然上传成功了，但还不能通过域名访问。使用NestJs配置非常简单，在`man.ts`主文件中定义

```js
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
	//传递类型NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  ...
  //静态资源访问
  app.useStaticAssets('uploads', {prefix: '/uploads'})
  await app.listen(3000)
}
bootstrap()
```

现在可以通过url正常访问图片了，如 **http://localhost:3000/uploads/xxxx.jpeg**

## CORS

跨源资源共享（`CORS`）是一种允许从另一个域请求资源的机制，前后端分离时不处理Cors将无权访问后端api。

- 后台定义了cors后，前端vue/react等不需对cors处理
- NestJs 使用了Express的 [expressjs/cors (opens new window)](https://github.com/expressjs/cors)包来处理，你可以查看[expressjs/cors (opens new window)](https://github.com/expressjs/cors#configuration-options)了解更多细节

同样修改`main.ts` 添加以下代码

```js
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  ...
  app.enableCors()
  await app.listen(3000)
}
bootstrap()
```

