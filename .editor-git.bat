@echo off
REM Git wrapper to override broken editor runtime injection
set GIT_EDITOR=true
git %*