FROM node:16-bookworm

WORKDIR /usr/src/app
COPY . .

# Install Docker Tools
RUN apt-get update
RUN apt-get install -y ca-certificates curl gnupg
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
RUN chmod a+r /etc/apt/keyrings/docker.asc
RUN chmod a+rx /etc/apt/keyrings
RUN echo "deb [signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get update
RUN apt-get install -y docker.io docker-compose-plugin

RUN npm install
EXPOSE 10000
CMD ["npm", "start"]

# -v //var/run/docker.sock:/var/run/docker.sock