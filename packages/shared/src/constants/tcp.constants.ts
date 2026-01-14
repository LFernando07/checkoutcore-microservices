export const TCPCONSTANTS = {
  servicesNames: {
    authService: 'auth_serviceTCP',
    userService: 'user_serviceTCP',
  },
  routingKeys: {
    authLogin: 'auth-login',
    validateToken: 'validate-token',
    createProfile: 'create-user',
    userProfileEmail: 'get-user-email-profile',
    userProfileId: 'get-user-id-profile'
  },
} as const;