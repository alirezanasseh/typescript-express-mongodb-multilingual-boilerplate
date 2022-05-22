FROM node:latest
RUN mkdir /app
WORKDIR /app
ADD . /app
COPY .env.sample .env
RUN npm install
RUN ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
ARG db_user
ARG db_pass
ENV PORT 8000
ENV MONGO_URI mongodb+srv://$db_user:<$db_pass>@cluster0.s5wsi.mongodb.net/?retryWrites=true&w=majority
CMD ["node", "dist/app.js"]
EXPOSE 8000