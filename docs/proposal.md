# Cartesi Hot Wallet  

The majority of users are on mobile.  
To succeed, we need to ensure:  

- A sustainable revenue model (e.g., Paio’s frontend fees).  
- A seamless way to deploy decentralized apps.  
- A verifiable frontend for security and trust.  
- A frictionless onboarding experience for new users.  

## Desktop vs Mobile  

_(Consider specifying the key differences, advantages, or challenges in each case.)_  

## Revenue Model  

- A small fee for swaps within the Cartesi Hot Wallet (a standard wallet revenue model).  
- A Paio fee for transactions interacting with our sequencer.  
- Web3 store checkout (swap a token for a product, so it's a swap revenue model).

## Seamless Deployment  

- A ready-to-use template following best practices for Cartesi app deployment.  

```sh
hot-wallet create my-app
cd my-app
code .
# dev work
hot-wallet deploy
```

**Optional:**  
> Backend running on AWS Lambda (or another serverless platform) for bare-metal computation.  

## Verifiable Frontend  

- Frontend compiled using Cartesi for verifiability.  
- Our wallet checks the on-chain hash to ensure integrity.  
- Apps follow a stake-based deployment model for security.  
- Only safe and verified apps are accessible.  

### Frontend Stake

A rank will be applied to show the heaviest staker first.
The stake is placed on a frontend version (hash).
IPFS as a hash verifier.

## Frictionless Onboarding  

- Only a strong password is required—no complex setup.  
- Inspired by ATM usability for an intuitive experience.  

**Optional:**  
> Withdraw limits: daily or monthly caps, with a trusted list for exceptions.  
