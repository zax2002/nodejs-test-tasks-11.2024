## Установка

```bash
$ npm i
$ cp sample.env .env
```

## Запуск БД

```bash
docker-compose up
```

## Запуск проекта

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Деплой

```bash
$ npm install -g mau
$ mau deploy
```
