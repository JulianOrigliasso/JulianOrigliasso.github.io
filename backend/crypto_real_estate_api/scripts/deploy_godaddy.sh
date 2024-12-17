#!/bin/bash
set -e

# Configuration
VENV_PATH="/home/wioas8h7gmfg/venv"
APP_PATH="/home/wioas8h7gmfg/crypto-real-estate-api"
PYTHON_VERSION="3.9"  # GoDaddy's default Python version

# Create application directory
mkdir -p $APP_PATH

# Copy application files
cp -r ../app $APP_PATH/
cp ../wsgi.py $APP_PATH/
cp ../requirements.txt $APP_PATH/

# Set up virtual environment
python$PYTHON_VERSION -m venv $VENV_PATH
source $VENV_PATH/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r $APP_PATH/requirements.txt

# Create .env file with database configuration
cat > $APP_PATH/.env << EOL
DB_HOST=118.139.183.221
DB_USER=crypto_estate_user
DB_PASSWORD=cryptoestatepassword
DB_NAME=wioas8h7gmfg_crypto_estate
SECRET_KEY=your-production-secret-key-here
EOL

# Create Apache configuration
cat > /home/wioas8h7gmfg/crypto_estate.conf << EOL
<VirtualHost *:80>
    ServerName 118.139.183.221
    DocumentRoot /home/wioas8h7gmfg/crypto-real-estate-api

    WSGIDaemonProcess crypto_estate python-path=/home/wioas8h7gmfg/crypto-real-estate-api:/home/wioas8h7gmfg/venv/lib/python3.9/site-packages
    WSGIProcessGroup crypto_estate
    WSGIScriptAlias / /home/wioas8h7gmfg/crypto-real-estate-api/wsgi.py

    <Directory /home/wioas8h7gmfg/crypto-real-estate-api>
        Require all granted
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/crypto_estate_error.log
    CustomLog \${APACHE_LOG_DIR}/crypto_estate_access.log combined
</VirtualHost>
EOL

echo "Deployment script completed. Please configure Apache to use the generated configuration file."
