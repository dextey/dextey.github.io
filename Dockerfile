
FROM golang:1.23.4 as builder

WORKDIR /


COPY go.mod ./

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o main .


FROM alpine:latest


WORKDIR /app

COPY static sections index.html ./
COPY --from=builder main  .


EXPOSE 3000


CMD ["./main"]
