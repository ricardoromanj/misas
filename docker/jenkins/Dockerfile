FROM docker:1.10.3-dind 
MAINTAINER Victor Fernandez <victor.j.fdez@gmail.com> 

# Install jre 8
RUN apk --no-cache add openjdk8-jre  &&\
    rm -rf /tmp/*

# Start container
CMD ["java","-version"]

# Install Jenkins

#USER root
#RUN apt-get update && \
#    apt-get install -y curl xz-utils 
#RUN curl -L -o rancher-compose.tar.xz https://github.com/rancher/rancher-compose/releases/download/v0.8.5/rancher-compose-linux-amd64-v0.8.5.tar.xz && \
#    tar xf rancher-compose.tar.xz && cp rancher-compose-v0.8.5/rancher-compose /usr/local/bin/ && \
#    rm -rf rancher-compose* && \
#    rancher-compose --version

# Setup environment
ENV JENKINS_VERSION %%VERSION%%
ENV JENKINS_USER jenkins
ENV JENKINS_GROUP jenkins
ENV JENKINS_HOME /opt/jenkins
ENV JENKINS_VOL /var/lib/jenkins

# Install software
RUN apk update &&\
    apk upgrade &&\
    mkdir -p $JENKINS_HOME $JENKINS_VOL/plugins $JAVA_BASE &&\
    curl -sSL http://mirrors.jenkins-ci.org/war/${JENKINS_VERSION}/jenkins.war --output ${JENKINS_HOME}/jenkins.war &&\
    addgroup ${JENKINS_GROUP} &&\
    adduser -h ${JENKINS_HOME} -D -s /bin/bash -G ${JENKINS_GROUP} ${JENKINS_USER} &&\
    chown -R ${JENKINS_USER}:${JENKINS_GROUP} ${JENKINS_HOME} ${JENKINS_VOL} &&\
    for plugins in credentials ssh-credentials ssh-agent ssh-slaves git-client git github github-api github-oauth ghprb scm-api postbuild-task greenballs; do  curl -sSL http://updates.jenkins-ci.org/latest/${plugins}.hpi --output $JENKINS_VOL/${plugins}.hpi; done


# Listen for main web interface (8080/tcp) and attached slave agents (50000/tcp)
EXPOSE 8080 50000

# Expose volumes
VOLUME ["${JENKINS_VOL}"]

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

USER ${JENKINS_USER}

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
