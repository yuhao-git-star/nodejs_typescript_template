FROM node:10.6.0
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
ENV NODE_ENV=production
COPY package*.json /usr/src/app/
RUN npm install
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 80
CMD [ "npm", "run", "prod" ]