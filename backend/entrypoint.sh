#!/bin/sh

# run in dev or prod
while getopts 'dpw:' FLAG
do
    case "$FLAG" in
        d)
            echo "Running Flask in debug mode" 
            flask --app backend.wsgi --debug run -h 0.0.0.0 -p 8000;;
        p) 
            echo "Running Gunicorn"
            gunicorn -c ./backend/gunicorn.conf.py backend.wsgi:handler;;
        w) 
            case "$OPTARG" in
                dev)
                    echo "Running Celery in development mode with auto-restart" 
                    watchmedo auto-restart --directory=./ --pattern=*.py --recursive -- celery -A backend.make_celery worker --concurrency=1 --loglevel INFO --uid=nobody --gid=nogroup;;
                prod) 
                    echo "Running Celery in production mode"
                    celery -A backend.make_celery worker --loglevel INFO;;
                *)
                    echo "Invalid deployment stage specified: $OPTARG"
            esac
            ;;
        *)
           echo "Invalid flag specified" 
        ;;
    esac
done



