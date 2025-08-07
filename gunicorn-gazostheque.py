import multiprocessing

bind = "0.0.0.0:8005"
workers = multiprocessing.cpu_count() * 2 + 1
threads = multiprocessing.cpu_count() * 2
timeout = 60

#logging
accesslog = '/home/vikhram/Gazostheque_App/logs/access.log'
errorlog = '/home/vikhram/Gazostheque_App/logs/error.log'

loglevel = 'debug' # most types of information 
capture_output = True
