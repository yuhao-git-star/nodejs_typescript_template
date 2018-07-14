# Nodejs use TypeScript Template

## required

Run `npm install` install dependencies.

## on build

Run `npm run build` will build js file under "dist" dir.

## on dev

Run `npm run dev` will run your node express server in lib/server.ts.

## on docker prod

Run `docker-compose up` or `docker build . -t {your_name/container_name}` will use docker deploy your application.

> warn: if run `npm run prod` will remove "dir lib" all file.

* config.ts need to input your Confidential information (e.g. database connent string, jwt private key ...)

## support commit to heroku

login and create your heroku application, and commit. just easy.

## support apiDoc generate

auto generate apiDoc, You just need to fill in what you need.