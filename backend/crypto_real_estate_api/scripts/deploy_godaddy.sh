#!/bin/bash
set -e

# Configuration
CPANEL_USER="wioas8h7gmfg"
VENV_PATH="/home/${CPANEL_USER}/public_html/crypto_real_estate/venv"
APP_PATH="/home/${CPANEL_USER}/public_html/crypto_real_estate/backend/crypto_real_estate_api"
PYTHON_VERSION="3.9"  # GoDaddy's default Python version
REMOTE_HOST="118.139.183.221"

echo "Starting deployment process..."

# Create deployment package
echo "Creating deployment package..."
cd "$(dirname "$(dirname "$0")")" || exit 1
tar -czf deploy.tar.gz \
    --exclude='*.pyc' \
    --exclude='__pycache__' \
    --exclude='.git' \
    --exclude='.env' \
    --exclude='venv' \
    .

# Upload package to server
echo "Uploading files to server..."
scp deploy.tar.gz "${CPANEL_USER}@${REMOTE_HOST}:/home/${CPANEL_USER}/public_html/"

# Remote server setup
ssh "${CPANEL_USER}@${REMOTE_HOST}" << EOF
    # Create directories
    mkdir -p "\$(dirname "\$APP_PATH")"
    cd "/home/${CPANEL_USER}/public_html" || exit 1

    # Extract files
    tar -xzf deploy.tar.gz -C crypto_real_estate
    rm deploy.tar.gz

    # Set up virtual environment
    echo "Setting up Python virtual environment..."
    python${PYTHON_VERSION} -m venv "\$VENV_PATH"
    source "\$VENV_PATH/bin/activate"

    # Install dependencies
    echo "Installing Python dependencies..."
    pip install --upgrade pip
    cd "\$APP_PATH" || exit 1
    pip install -r requirements.txt

    # Create .env file with database configuration
    echo "Configuring environment variables..."
    cat > .env << EOFENV
DB_HOST=localhost
DB_USER=crypto_estate_user
DB_PASSWORD=cryptoestatepassword
DB_NAME=wioas8h7gmfg_crypto_estate
SECRET_KEY=\$(openssl rand -hex 32)
ALLOWED_HOSTS=wioas8h7gmfg.prod.sin2.secureserver.net,${REMOTE_HOST}
EOFENV

    # Set correct permissions
    chmod 755 -R "/home/${CPANEL_USER}/public_html/crypto_real_estate"
    find "/home/${CPANEL_USER}/public_html/crypto_real_estate" -type f -exec chmod 644 {} \;
    find "\$VENV_PATH/bin" -type f -exec chmod 755 {} \;
    chmod 755 "\$APP_PATH/wsgi.py"
EOF

echo "Deployment completed successfully!"
echo "Next steps:"
echo "1. Ensure mod_wsgi is installed and configured"
echo "2. Link Apache configuration file"
echo "3. Restart Apache to apply changes"
