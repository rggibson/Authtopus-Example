import os
import sys

from google.appengine.ext import vendor

ENDPOINTS_PROJECT_DIR = os.path.join( os.path.dirname( __file__ ),
                                     'ext/endpoints_proto_datastore' )
AUTHTOPUS_PROJECT_DIR = os.path.join( os.path.dirname( __file__ ),
                                      'ext/authtopus' )

sys.path.extend( [ ENDPOINTS_PROJECT_DIR, AUTHTOPUS_PROJECT_DIR, ] )

vendor.add('lib')
