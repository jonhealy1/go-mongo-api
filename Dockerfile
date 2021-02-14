FROM golang:1.14

FROM golang:1.14

WORKDIR /go/src/app
COPY ./api .
 
RUN go get -d -v ./...
RUN go install -v ./...
 
EXPOSE 4747
 
CMD ["go","run","main.go"]