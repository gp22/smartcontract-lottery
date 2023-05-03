const { ethers } = require('hardhat')

const networkConfig = {
  11155111: {
    name: 'Sepolia',
    ethUsdPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    vrfCoordinatorV2: '0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625',
    entranceFee: ethers.utils.parseEther('0.01'),
    gasLane:
      '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c',
    subscriptionId: '0',
    callbackGasLimit: '500000', // 500,000
    interval: '30',
  },
  31337: {
    name: 'hardhat',
    entranceFee: ethers.utils.parseEther('0.01'),
    gasLane:
      '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c',
    callbackGasLimit: '500000', // 500,000
    interval: '30',
  },
}

const developmentChains = ['hardhat', 'localhost']
const BASE_FEE = ethers.utils.parseEther('0.25') // I costs 0.25 LINK per request.
const GAS_PRICE_LINK = 1e9 // Calculated value based on the gas price of the chain.
const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther('2')

module.exports = {
  networkConfig,
  developmentChains,
  BASE_FEE,
  GAS_PRICE_LINK,
  VRF_SUB_FUND_AMOUNT,
}
