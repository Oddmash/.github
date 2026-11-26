# Sourced by the launcher and its internal Git credential helper.
fail() {
  printf '%s\n' "$1" >&2
  exit 1
}

load_github_credential() {
  # GitHub CLI stores per-account entries under the gh:github.com service.
  case "$(uname -s)" in
    Darwin)
      entry=$(security find-generic-password -s gh:github.com -a qtaghdi -w 2>/dev/null) ||
        fail 'Use the qtaghdi credential in the system keychain.'
      case "$entry" in
        go-keyring-base64:*)
          GH_TOKEN=$(printf '%s' "${entry#go-keyring-base64:}" | base64 -D 2>/dev/null) ||
            fail 'Cannot decode the qtaghdi credential.'
          ;;
        go-keyring-encoded:*) fail 'Refresh the legacy qtaghdi keychain entry with GitHub CLI.' ;;
        *) GH_TOKEN=$entry ;;
      esac
      ;;
    Linux)
      GH_TOKEN=$(secret-tool lookup service gh:github.com username qtaghdi 2>/dev/null) ||
        fail 'Use the qtaghdi credential in the system keychain with secret-tool.'
      ;;
    *) fail 'The launcher supports macOS Keychain and Linux Secret Service.' ;;
  esac
  case "$GH_TOKEN" in
    ''|*[!a-zA-Z0-9_]*) fail 'The qtaghdi keychain entry is not a GitHub token.' ;;
  esac
  export GH_TOKEN
  identity=$(gh api user --hostname github.com --jq '.login + ":" + (.id | tostring)') ||
    fail 'Cannot verify the qtaghdi GitHub account.'
  [ "$identity" = 'qtaghdi:135234546' ] || fail 'The GitHub credential does not belong to qtaghdi.'
}

git_github_credential() {
  protocol= host=
  while IFS= read -r field && [ -n "$field" ]; do
    case "$field" in
      protocol=https) protocol=https ;;
      host=github.com) host=github.com ;;
      username=qtaghdi) ;;
      protocol=*|host=*|username=*) return 1 ;;
    esac
  done
  [ "$protocol" = https ] && [ "$host" = github.com ] || return 1
  load_github_credential
  printf 'username=qtaghdi\npassword=%s\n\n' "$GH_TOKEN"
}
