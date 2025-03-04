FROM denoland/deno:2.1.9

RUN adduser denouser --gecos "" --disabled-password && \
    chown -R denouser:denouser /deno-dir && \
    apt-get update && \
    apt-get install -y git && \
    rm -fr /var/lib/apt/lists/*

CMD [ "/bin/bash" ]
