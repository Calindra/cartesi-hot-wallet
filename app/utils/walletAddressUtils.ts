export const walletAddressShortner = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

export const emailShortner = (email: string) => {
  return `${email.substring(0, 3)}...${email.substring(email.length - 9)}`
}
