const { ethers, network } = require('hardhat')
const fs = require('fs')
require('dotenv').config()

const UPDATE_FRONTEND = process.env.UPDATE_FRONTEND || false
const FRONTEND_ADDRESSES_FILE = process.env.FRONTEND_ADDRESSES_FILE || ''
const FRONTEND_ABI_FILE = process.env.FRONTEND_ABI_FILE || ''

async function updateContractAddresses() {
  const lottery = await ethers.getContract('Lottery')
  const chainId = network.config.chainId.toString()
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONTEND_ADDRESSES_FILE, 'utf-8')
  )

  if (
    chainId in currentAddresses &&
    !currentAddresses[chainId].includes(lottery.address)
  ) {
    currentAddresses[chainId].push(lottery.address)
  } else {
    currentAddresses[chainId] = [lottery.address]
  }

  fs.writeFileSync(FRONTEND_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

async function updateAbi() {
  const lottery = await ethers.getContract('Lottery')
  fs.writeFileSync(
    FRONTEND_ABI_FILE,
    lottery.interface.format(ethers.utils.FormatTypes.json)
  )
}

module.exports = async function () {
  if (
    UPDATE_FRONTEND === 'true' &&
    FRONTEND_ADDRESSES_FILE &&
    FRONTEND_ABI_FILE
  ) {
    console.log('Updating frontend...')
    updateContractAddresses()
    updateAbi()
  }
}

module.exports.tags = ['all', 'frontend']
