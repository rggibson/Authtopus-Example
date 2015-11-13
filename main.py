# TODO: This stuff should be in appengine_config.py, but that doesn't seem to
# be loading for some reason with the -url: (.*) handler present for some
# reason...
import os
import sys

ENDPOINTS_PROJECT_DIR = os.path.join( os.path.dirname( __file__ ),
                                     'ext/endpoints_proto_datastore' )
AUTHTOPUS_PROJECT_DIR = os.path.join( os.path.dirname( __file__ ),
                                      'ext/authtopus' )

sys.path.extend( [ ENDPOINTS_PROJECT_DIR, AUTHTOPUS_PROJECT_DIR, ] )

import endpoints
import webapp2

from authtopus.api import Auth
from authtopus.cron import CleanupTokensHandler, CleanupUsersHandler

API = endpoints.api_server( [ Auth ], restricted=False )

CRON = webapp2.WSGIApplication(
    [ ( '/cron/auth/cleanup-tokens/?', CleanupTokensHandler ),
      ( '/cron/auth/cleanup-users/?', CleanupUsersHandler ) ]
)
