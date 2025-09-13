#!/bin/bash
# Git wrapper to override broken editor runtime injection
export GIT_EDITOR=true
git "$@"