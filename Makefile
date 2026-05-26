.PHONY: install lint lint-report mock mock-iot mock-vision mock-all local-iot test-mock test-local test-html test-ci clean

install:
	npm install

lint:
	npm run lint:contracts

lint-report:
	npm run lint:contracts:report

mock: mock-iot

mock-iot:
	npm run mock:iot

mock-vision:
	npm run mock:vision

mock-all:
	npm run mock:all

local-iot:
	npm run local:iot

test-mock:
	npm run test:mock

test-local:
	npm run test:local

test-html:
	npm run test:html

test-ci:
	npm run test:ci

clean:
	rm -f reports/*.xml reports/*.html reports/*.json prism*.log
