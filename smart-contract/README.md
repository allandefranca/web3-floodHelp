# smart-contract

Our FloodHelp smart contract. Project from Web3 Week: https://www.luiztools.com.br/w3w

# FloodHelp Smart Contract

FloodHelp is a decentralized application (DApp) designed to facilitate aid and donations for flood relief efforts. The smart contract allows users to open requests for assistance, donate to requests, and manage the status of these requests. An admin has special privileges to manage blacklists and change request statuses.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Opening a Request](#opening-a-request)
  - [Viewing Pending Requests](#viewing-pending-requests)
  - [Changing Request Status](#changing-request-status)
  - [Closing a Request](#closing-a-request)
  - [Donating to a Request](#donating-to-a-request)
  - [Getting Open Requests](#getting-open-requests)
  - [Managing Blacklist](#managing-blacklist)
- [License](#license)

## Installation

To work with this smart contract, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/allandefranca/web3-floodHelp.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd floodhelp
    ```

3. **Compile the contract**:
    Use your preferred Solidity development environment to compile the `FloodHelp.sol` contract. For example, you can use [Remix](https://remix.ethereum.org/).

4. **Deploy the contract**:
    Deploy the `FloodHelp` contract to your desired Ethereum network.

## Usage

### Opening a Request

Users can open a new request for flood help with appropriate details such as title, description, contact information, and a fundraising goal.

```solidity
function openRequest(string memory title, string memory description, string memory contact, uint goal) public notBlacklisted;
```

### Viewing Pending Requests

To view all pending requests, a specific function can be called that returns a list of requests with a status of pending.

```solidity
function viewPendingRequests() public view returns (Request[] memory);
```

### Changing Request Status

The admin has the ability to change the status of a request. This can be used to approve or deny requests.

```solidity
function changeRequestStatus(uint id, RequestStatus newStatus) public onlyAdmin;
```

### Closing a Request

Requests can be closed by the author or automatically when the fundraising goal is met. Upon closing, any collected funds are transferred to the request author.

```solidity
function closeRequest(uint id) public;
```

### Donating to a Request

Users can donate to a specific request by sending funds. Donations are only accepted for requests that are open.

```solidity
function donate(uint id) public payable notBlacklisted;
```

### Getting Open Requests

To get a list of open requests starting from a specific ID, a function can be called that returns the desired number of open requests starting from a specified ID.

```solidity
function getOpenRequests(uint startId, uint quantity) public view returns (Request[] memory);
```

### Managing Blacklist

The admin can manage a blacklist of addresses, adding or removing addresses as necessary to prevent misuse of the platform.

```solidity
function addToBlacklist(address _address) public onlyAdmin;
```
```solidity
function removeFromBlacklist(address _address) public onlyAdmin
```

## License

This project is licensed under the MIT License.



