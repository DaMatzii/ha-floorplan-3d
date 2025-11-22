#!/bin/bash


#Generating types for reading config files
quicktype schemas/building.json schemas/home_config.json \
	--src-lang schema \
	--just-types \
	--top-level Building \
	--lang typescript \
	--out apps/client/src/types/types.d.ts 


#Generating AppConfig for go backend
quicktype  schemas/configuration.json \
	--src-lang schema \
	--just-types \
	--top-level AppConfig  \
	--package models \
	--out apps/backend/models/AppConfig.go 


