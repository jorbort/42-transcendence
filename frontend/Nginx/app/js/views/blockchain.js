const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "date",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "winner",
				"type": "string"
			}
		],
		"name": "ResultAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "date",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "winner",
				"type": "string"
			}
		],
		"name": "addResult",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getResults",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "date",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "winner",
						"type": "string"
					}
				],
				"internalType": "struct TournamentResults.Result[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "results",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "date",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "winner",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = "0x61ABF63e94ed1ba2c7a0954E27cec76014273e03";

export async function connectToMetaMask() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed. Please, install to proceed.");
        return false;
    }
    await ethereum.request({ method: "eth_requestAccounts" });
    return true;
}

export async function saveToBlockchain(name, date, winner) {
	const web3 = new Web3(window.ethereum);

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    try {
        await contract.methods.addResult(name, date, winner).send({ from: account });
        alert("Tournament details saved to blockchain successfully.");
    } catch (error) {
        console.error("Error: ", error);
        alert("Error occurred while trying to upload tournament details.");
    }
}
