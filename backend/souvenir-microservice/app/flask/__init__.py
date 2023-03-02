"""
This file contains the application factory.
"""

import connexion
from swagger_ui_bundle import swagger_ui_path
from flask_cors import CORS
import config

def create_app():
    """This function is the application factory. It creates the connexion
    application with the necessary configuration and registration.

    Returns:
        The created application instance.

    """
    # Use newer version of swagger ui
    options = {'swagger_path': swagger_ui_path}

    app = connexion.App(__name__,
                        specification_dir=config.SPECIFICATION_DIR,
                        options=options)
    CORS(app.app)
    app.add_api('swagger.yaml',
                strict_validation=True,
                validate_responses=True)

    return app


