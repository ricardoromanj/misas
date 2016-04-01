FROM meteorhacks/meteord:base
MAINTAINER Ricardo Roman <ricardo.roman@ticnsp.org>

ONBUILD COPY ../../ /app
ONBUILD RUN bash $METEOR_DIR/on_build.sh
