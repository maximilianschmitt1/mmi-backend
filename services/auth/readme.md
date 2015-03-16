# api information

Connect via dnode on port `5001`

## methods

* `register({ email, password, passwordConfirmation }): { user }`
* `authenticate({ email, password }): { token }`
* `identify({ token }): { user }`

# dependencies

* MongoDB
* node.js

# security risks

This is a minimalistic auth implementation using JSON web tokens. Currently, auth tokens are valid (as long as the secret it is signed with is valid) and there is no option to expire tokens.