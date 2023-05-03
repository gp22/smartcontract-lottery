const { network } = require('hardhat')
const {
  developmentChains,
  BASE_FEE,
  GAS_PRICE_LINK,
} = require('../helper-hardhat-config')

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const args = [BASE_FEE, GAS_PRICE_LINK]

  if (developmentChains.includes(network.name)) {
    log('Local network detected. Deploying mocks...')
    // Deploy a mock VRF Coordinator.
    await deploy('VRFCoordinatorV2Mock', {
      from: deployer,
      log: true,
      args,
    })
    log('Mocks deployed.')
    log('=============================================')
  }
}

module.exports.tags = ['all', 'mocks']
