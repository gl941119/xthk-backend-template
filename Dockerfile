FROM reg.xthklocal.cn/xthk-library/nginx:1.16.0

ENV XTHK_CODE_SOURCE=./dist
COPY $XTHK_CODE_SOURCE $XTHK_CODE_ROOT
WORKDIR /var/www/code/app