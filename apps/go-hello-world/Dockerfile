FROM golang:1.24-alpine AS build

WORKDIR /src

COPY go.mod ./
COPY main.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/go-hello-world .

FROM scratch

COPY --from=build /out/go-hello-world /go-hello-world

USER 65532:65532
EXPOSE 3000

ENTRYPOINT ["/go-hello-world"]
