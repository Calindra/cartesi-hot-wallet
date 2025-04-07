export const walletAddressShortener = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

export const emailShortener = (email: string) => {
  return `${email.substring(0, 3)}...${email.substring(email.length - 9)}`
}
