import multiprocessing

bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
accesslog = "-" # STDOUT
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(q)s" "%(D)s"'
keepalive = 120
timeout = 120
worker_class = "gevent"
worker_connections = 1000
