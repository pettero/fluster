#!/usr/bin/python
"""
This is created by Petter Olofsson Co funder of Screen Interaction
"""
import os
import os.path
import sys
import getopt
import logging
import json
import re
import shutil
import codecs
#import unicodedata

def usage():
	"""
	Prints descriptions on how to use the program
	"""
	print ("""This script creates a json complient document the from a file structure.
	More information about the useage can be found a http://www.fluster.se/jqscr
	jqscrbld

	FLAGS
	-h --help 		Shows this text
	-v --verbose	Does a verbose printing of what's going on
	-e --export		The file name to export the content to

	""")

	sys.exit(0)

def parse_tree(folder=".", tree=dict({})):
	"""
	Gets all the files in the folder and adds them as arguments to a map object
	All folders are recursivly called and added to the tree
	"""
	logging.debug("Looking in path %s" % folder)
	content = os.listdir(folder)
	logging.debug("content is %s" % content)
	for f in content:
		if os.path.isfile(folder + "/" + f):
			# Get file ending
			dot_index = f.rfind(".")
			if f[dot_index+1:] not in ("js", "html", "txt"):
				logging.debug("%s is not html, js or txt file" % f)
				continue
			logging.debug("opening %s/%s" % (folder, f))
			
			# ola was here BEGIN
			#print("opening: " + folder + "/" + f)
			fun = codecs.open(folder + "/" + f,"r","utf_8_sig")
			#fun = open(folder + "/" + f)
			# olad was here END

			file_content = fun.read()

			if f[dot_index+1:] in ("html"):
				file_content = file_content.replace("\n","")
				file_content = file_content.replace("\t","")
			logging.debug("file_content: %s" % file_content)
			logging.debug("file name: %s" % f[:dot_index])
			tree[f[:dot_index]] = file_content
			fun.close()
			logging.debug("closing file %s/%s" % (folder, f))
		elif os.path.isdir(folder + "/" + f):
			logging.debug("folder: %s" % (folder + "/" + f))
			if f.find(".svn") > -1:
				logging.debug("%s subversion directory" % f)
				continue
			tree[f] = parse_tree(folder + "/" + f, dict({}))
		else:
			logging.debug("not a folder or file. filename is %s" % f)
	return tree

def rc():
	"""
	Reads the resource file
	"""
	if not os.path.isfile(".jqscrbldrc"):
		msg = "no resource file, exiting"
		logging.error(msg)
		#print msg
		sys.exit(1)
	f = open(".jqscrbldrc", "r")
	logging.debug("resource file opened")
	try:
		j = json.loads(f.read())
		logging.debug("resource file loaded")
	except:
		x.error("Error parsing exception, %s" % sys.exc_info()[0])
		sys.exit(1)
	f.close()
	logging.debug("resource file closed")
	return j

def main(argv):
	"""
	Parses all argurments and starts the program
	"""
	# Setting some default values
	# Setting up the logger object
	LOG_FILENAME = "jqscrbld.log"
	logging.basicConfig(filename=LOG_FILENAME,level=logging.DEBUG)
	
	settings = rc()
	file_name = None
	# Get the arguments from the command line
	opts, args = getopt.getopt(argv, "hve:", ["help","verbose","export="])
	for opt, arg in opts:
		logging.debug(opt)
		if opt in ("-h", "--help"):
			usage()
		if opt in ("-v", "--verbose"):
			# Set the logging level
			logging.basicConfig(filename=LOG_FILENAME,level=logging.DEBUG)
		if opt in ("-e", "--export"):
			file_name = arg
	if file_name is None:
		file_name = "fluster"
	# Start building the JavaScript object from the file structure
	logging.debug("parsing is starting")
	tree = parse_tree("fluster")
	if os.path.isfile(file_name):
		logging.debug("removing %s" % file_name)
		os.remove("js/%s" % file_name)

	#ola was here BEGIN
	#javascript_file = open("js/%s.js" % file_name, 'w')
	javascript_file = codecs.open("js/%s.js" % file_name, 'w',"utf_8_sig")
	#ola was here END

	logging.debug("Opening file %s for writing" % file_name)
	json_str = json.dumps(tree)

	javascript_file.write("var %s = %s;" % (file_name, json_str))
	
	logging.debug("Written data to %s" % file_name)
	javascript_file.close()
	logging.debug("Closing file %s" % file_name)
	
	logging.debug("Start moving files to their correct place")
	if "deploy" in settings["default"]:
		if os.path.isdir(settings["default"]["deploy"]):
			logging.debug("removing the previous directory")
			shutil.rmtree(settings["default"]["deploy"])
		logging.debug("Deploy the files")
		shutil.copytree(".", settings["default"]["deploy"])
	
if __name__ == '__main__':
	main(sys.argv[1:])
