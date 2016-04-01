FROM meteorhacks/meteord:base
MAINTAINER Ricardo Roman <ricardo.roman@ticnsp.org>

ONBUILD RUN bash $METEOR_DIR/lib/install_meteor.sh
ONBUILD COPY ../../ /app
ONBUILD RUN bash $METEOR_DIR/lib/build_app.sh
