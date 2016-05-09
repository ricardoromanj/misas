FROM node:0.10.43
MAINTAINER Ricardo Roman <ricardo.roman@ticnsp.org>

# Fix by creating symlink
RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs

ADD bundle /opt/app
RUN cd /opt/app/programs/server && npm install

WORKDIR /opt/app

ENV PORT 3000
EXPOSE 3000

CMD ["node", "main.js"]
