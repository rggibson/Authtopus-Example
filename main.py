import endpoints
import webapp2

from authtopus.api import Auth
from authtopus.cron import CleanupTokensHandler, CleanupUsersHandler

API = endpoints.api_server( [ Auth ], restricted=False )

CRON = webapp2.WSGIApplication(
    [ ( '/cron/auth/cleanup-tokens/?', CleanupTokensHandler ),
      ( '/cron/auth/cleanup-users/?', CleanupUsersHandler ) ]
)
