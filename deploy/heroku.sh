#!/bin/sh

heroku container:push web -a=tinymassive
heroku container:release web -a=tinymassive
