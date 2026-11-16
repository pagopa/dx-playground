FROM public.ecr.aws/docker/library/golang:1.27-alpine3.23@sha256:7a93747afee80359e81dbe39c8a65037b147cada0262bf86f5b96dd06842b368 AS build

WORKDIR /src

COPY go.mod main.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/go-hello-world .

FROM scratch

COPY --from=build /out/go-hello-world /go-hello-world

USER 65532:65532
EXPOSE 3000

ENTRYPOINT ["/go-hello-world"]
