export async function generateToken(user) {
  const payload = { login: user.login, _id: user._id };
  const accessToken = this.jwtService.sign(payload, {
    secret: process.env.ACCESS_SERCET,
    expiresIn: '1h',
  });
  const refreshToken = this.jwtService.sign(payload, {
    secret: process.env.REFRESH_SECRET,
    expiresIn: '1d',
  });
  return {
    accessToken,
    refreshToken,
  };
}
