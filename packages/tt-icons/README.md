# Shared Icons library

## Introduction
This repo export Svg icons as a react components.

## Getting started
To start, please ensure you have the following installed on your local machine:
- [node v12.18.0](https://nodejs.org/en/)

node v12.18.0 is required to build react component from svg using svgr.

## Add new icon and create its react components
1. To add a new svg icon, add svg in `svg/original` folder.
2. To create react component of svg run `npm run build:icon`
3. To create a fresh build run `npm run build`

## Command

1. `npm run build:icon` It performs two actions.
  - run svgo and optimised the svg/original folder in svg/optimised
  - run svgr and created react component of svgs in svg/optimised.
