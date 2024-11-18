FROM node:22.11-alpine3.20
RUN apk add --no-cache bash tzdata
ENV TZ=Africa/Cairo
WORKDIR /reading-recommendation-system-api
COPY ["./package.json","tsconfig.json" , "./.npmrc","/reading-recommendation-system-api"]
RUN npm install -g npm@10.9.0
RUN npm install --legacy-peer-deps
RUN npm install -g dotenv-cli
COPY . .
RUN npm run build
RUN npm cache clean --force
EXPOSE 3000
CMD ["npm" , "run", "start:prod"]

