# Use an official node runtime as a parent image
FROM node:current-alpine3.12

WORKDIR /app/

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Add rest of the client code
COPY . ./

EXPOSE 3000

CMD ["yarn", "start"]