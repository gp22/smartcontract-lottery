const { network } = require('hardhat')
const {
  developmentChains,
  networkConfig,
  VRF_SUB_FUND_AMOUNT,
} = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  const isDevelopmentChain = developmentChains.includes(network.name)
  let vrfCoordinatorV2Address, subscriptionId

  if (isDevelopmentChain) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      'VRFCoordinatorV2Mock'
    )
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
    const transactionReceipt = await transactionResponse.wait(1)
    subscriptionId = transactionReceipt.events[0].args.subId
    // Fund the subscription. On a real network you'd need real LINK tokens.
    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_SUB_FUND_AMOUNT
    )
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
    subscriptionId = networkConfig[chainId].subscriptionId
  }

  const { entranceFee, gasLane, callbackGasLimit, interval } =
    networkConfig[chainId]
  const args = [
    vrfCoordinatorV2Address,
    entranceFee,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    interval,
  ]
  const lottery = deploy('Lottery', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  if (!isDevelopmentChain && process.env.ETHERSCAN_API_KEY) {
    await verify(lottery.address, args)
  }

  log('=============================================')
}

module.exports.tags = ['all', 'lottery']
