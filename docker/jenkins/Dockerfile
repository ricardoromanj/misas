FROM jenkins:1.651.3

#install curl, and get rancher-compose
USER root
RUN apt-get update && \
    apt-get install -y curl && \
    curl -L -o rancher-compose.tar.xz https://github.com/rancher/rancher-compose/releases/download/v0.8.5/rancher-compose-linux-amd64-v0.8.5.tar.xz && \
    tar -xf rancher-compose.tar.xz && cp rancher-compose-v0.8.5/rancher-compose /usr/local/bin/ && \
    rm -rf rancher-compose* && \
    rancher-compose --version
USER jenkins
COPY plugins.txt /usr/share/jenkins/plugins.txt
RUN /usr/local/bin/plugins.sh /usr/share/jenkins/plugins.txt
