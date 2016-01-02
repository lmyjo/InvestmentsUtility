all: build-release

build-release:
	docker build -t lmyjo/investments-utility -f docker/Dockerfile .
