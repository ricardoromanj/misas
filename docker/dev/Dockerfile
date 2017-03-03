FROM debian:latest
MAINTAINER Ricardo Roman <ricardo.roman@ticnsp.org>

RUN apt-get update && apt-get install -y curl

RUN curl https://install.meteor.com | sh
RUN mkdir /app
WORKDIR /app

CMD ["bash -s"]
