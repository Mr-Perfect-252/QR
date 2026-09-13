name: Generate keystore and save to repo secrets

on:
  workflow_dispatch:
    inputs:
      keystore-file:
        description: 'Keystore filename'
        required: false
        default: 'release-keystore.jks'
      alias:
        description: 'Key alias'
        required: false
        default: 'upload'
      storepass:
        description: 'Keystore store password'
        required: false
        default: 'changeit'
      keypass:
        description: 'Key password (leave empty to use storepass)'
        required: false
        default: ''
      dname:
        description: 'Distinguished Name'
        required: false
        default: 'CN=Your Name, OU=Dev, O=Company, L=City, ST=State, C=US'
      overwrite:
        description: 'Overwrite existing secrets? (true/false)'
        required: false
        default: 'false'

jobs:
  generate-and-save:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      actions: write   # necessary only if using gh authentication via PAT in a secret
    steps:
      - name: Checkout repo (not strictly needed)
        uses: actions/checkout@v4

      - name: Set inputs as env
        run: |
          echo "KS_FILE=${{ github.event.inputs['keystore-file'] }}" >> $GITHUB_ENV
          echo "ALIAS=${{ github.event.inputs['alias'] }}" >> $GITHUB_ENV
          echo "STOREPASS=${{ github.event.inputs['storepass'] }}" >> $GITHUB_ENV
          echo "KEYPASS=${{ github.event.inputs['keypass'] }}" >> $GITHUB_ENV
          echo "DNAME='${{ github.event.inputs['dname'] }}'" >> $GITHUB_ENV
          echo "OVERWRITE=${{ github.event.inputs['overwrite'] }}" >> $GITHUB_ENV

      - name: Ensure keypass defaults to storepass
        run: |
          if [ -z "${KEYPASS}" ] || [ "${KEYPASS}" = "''" ]; then
            echo "KEYPASS=${STOREPASS}" >> $GITHUB_ENV
          fi

      - name: Generate keystore
        run: |
          set -euo pipefail
          KS_FILE="${KS_FILE:-release-keystore.jks}"
          ALIAS="${ALIAS:-upload}"
          STOREPASS="${STOREPASS:-changeit}"
          KEYPASS="${KEYPASS:-$STOREPASS}"
          DNAME=${DNAME:-'CN=Your Name, OU=Dev, O=Company, L=City, ST=State, C=US'}

          echo "Generating keystore $KS_FILE (alias=$ALIAS)"
          keytool -genkeypair \
            -v \
            -keystore "$KS_FILE" \
            -alias "$ALIAS" \
            -keyalg RSA \
            -keysize 2048 \
            -validity 10000 \
            -storepass "$STOREPASS" \
            -keypass "$KEYPASS" \
            -dname "$DNAME"

          echo "Keystore generated: $KS_FILE"
          echo "Listing cert (short):"
          keytool -list -v -keystore "$KS_FILE" -alias "$ALIAS" -storepass "$STOREPASS" | sed -n '1,12p'

          KS_BASE64=$(base64 "$KS_FILE" | tr -d '\n')
          echo "::set-output name=ks_base64::$KS_BASE64"
          echo "::set-output name=storepass::$STOREPASS"
          echo "::set-output name=keypass::$KEYPASS"
          echo "::set-output name=alias::$ALIAS"

      - name: Install GitHub CLI (gh)
        run: |
          sudo apt-get update
          sudo apt-get install -y curl apt-transport-https ca-certificates gnupg
          curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
          sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
          echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
          sudo apt-get update
          sudo apt-get install -y gh

      - name: Authenticate gh with ADMIN_PAT
        env:
          ADMIN_PAT: ${{ secrets.ADMIN_PAT }}
        run: |
          if [ -z "${ADMIN_PAT:-}" ]; then
            echo "ERROR: ADMIN_PAT secret is empty. Create a PAT with repo permissions and add it as repository secret ADMIN_PAT before running this workflow." >&2
            exit 1
          fi
          echo "${ADMIN_PAT}" | gh auth login --with-token

      - name: Upload keystore and passwords to repo secrets
        run: |
          KS_BASE64="${{ steps.generate-and-save.outputs.ks_base64 }}"
          STOREPASS="${{ steps.generate-and-save.outputs.storepass }}"
          KEYPASS="${{ steps.generate-and-save.outputs.keypass }}"
          ALIAS="${{ steps.generate-and-save.outputs.alias }}"
          REPO="${GITHUB_REPOSITORY}"

          # If overwrite is false, ensure we don't clobber
          if [ "${{ github.event.inputs.overwrite }}" != "true" ]; then
            for s in KEYSTORE_BASE64 KEYSTORE_PASSWORD KEY_PASSWORD KEYSTORE_ALIAS; do
              if gh secret list --repo "$REPO" | grep -q "^$s$"; then
                echo "Secret $s already exists. Re-run with overwrite=true to replace."
                exit 1
              fi
            done
          fi

          gh secret set KEYSTORE_BASE64 --repo "$REPO" --body "$KS_BASE64"
          gh secret set KEYSTORE_PASSWORD --repo "$REPO" --body "$STOREPASS"
          gh secret set KEY_PASSWORD --repo "$REPO" --body "$KEYPASS"
          gh secret set KEYSTORE_ALIAS --repo "$REPO" --body "$ALIAS"

          echo "Secrets created/updated: KEYSTORE_BASE64, KEYSTORE_PASSWORD, KEY_PASSWORD, KEYSTORE_ALIAS"
