import { abi, contractAddress } from './constants.js'
import { ethers } from './ethers-5.6.esm.min.js'

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')
const balanceButton = document.getElementById('balanceButton')
const withdrawButton = document.getElementById('withdrawButton')

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum != 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        document.getElementById('connectButton').innerHTML = 'Connected!'
    } else {
        console.log('Please install metamask')
    }
}

async function fund() {
    const ethAmount = document.getElementById('ethAmount').value
    if (typeof window.ethereum != 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionToMine(transactionResponse, provider)
            console.log('Done!')
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log('Please install metamask')
    }
}

function listenForTransactionToMine(transactionResponse, provider) {
    console.log('Waiting for transaction to be mined!')
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `completed with ${transactionReceipt.confirmations} confirmations`
            )
        })
        resolve()
    })
}

async function getBalance() {
    if (typeof window.ethereum != 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        document.getElementById('balanceLabel').innerHTML =
            ethers.utils.formatEther(balance)
    } else {
        console.log('Please install metamask')
    }
}

async function withdraw() {
    if (typeof window.ethereum != 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionToMine(transactionResponse, provider)
            console.log('Withdraw done!')
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log('Please install metamask')
    }
}
