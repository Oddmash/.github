#!/bin/sh
# Keep launcher-only transport and credential configuration out of repository hooks.
set +x
set -eu

hook="$ODDMASH_AI_ORIGINAL_HOOKS/${0##*/}"
if [ "$ODDMASH_AI_INHERITED_CONFIG_SET" = x ]; then
  GIT_CONFIG_PARAMETERS=$ODDMASH_AI_INHERITED_CONFIG
  export GIT_CONFIG_PARAMETERS
else
  unset GIT_CONFIG_PARAMETERS
fi
unset ODDMASH_AI_KEYCHAIN ODDMASH_AI_ORIGINAL_HOOKS
unset ODDMASH_AI_INHERITED_CONFIG_SET ODDMASH_AI_INHERITED_CONFIG
exec "$hook" "$@"
