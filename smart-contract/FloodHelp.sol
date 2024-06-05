// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

struct Request {
    uint id;
    address author;
    string title;
    string description;
    string contact;
    uint timestamp;
    uint goal; // in wei
    uint balance;
    uint totalDonations;
    RequestStatus status;
}

enum RequestStatus { Pending, Open, Closed }

contract FloodHelp {

    address admin;
    uint public lastId = 0;
    mapping(uint => Request) public requests;
    mapping(address => bool) public blacklist;

    constructor() {
        admin = msg.sender;
    }

    // Modifier to check if the caller is the admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Modifier to check if the address is blacklisted
    modifier notBlacklisted() {
        require(!blacklist[msg.sender], "Address is blacklisted");
        _;
    }

    // Add address to blacklist
    function addToBlacklist(address _address) public onlyAdmin {
        blacklist[_address] = true;
    }

    // Remove address from blacklist
    function removeFromBlacklist(address _address) public onlyAdmin {
        blacklist[_address] = false;
    }

    // Open a new request for flood help with validation
    function openRequest(string memory title, string memory description, string memory contact, uint goal) public notBlacklisted {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(contact).length > 0, "Contact cannot be empty");
        require(goal > 0, "Goal must be greater than 0");

        // Check for author duplication of open requests with the same title
        for (uint i = 1; i <= lastId; i++) {
            if (requests[i].author == msg.sender && requests[i].status == RequestStatus.Open && keccak256(bytes(requests[i].title)) == keccak256(bytes(title))) {
                revert("You already have an open request with the same title");
            }
        }

        lastId++;
        requests[lastId] = Request({
            id: lastId,
            title: title,
            description: description,
            contact: contact,
            goal: goal,
            balance: 0,
            totalDonations: 0,
            timestamp: block.timestamp,
            author: msg.sender,
            status: RequestStatus.Pending
        });
    }

    // View pending requests
    function viewPendingRequests() public view returns (Request[] memory) {
        uint pendingCount = 0;

        for (uint i = 1; i <= lastId; i++) {
            if (requests[i].status == RequestStatus.Pending) {
                pendingCount++;
            }
        }

        Request[] memory pendingRequests = new Request[](pendingCount);
        uint index = 0;

        for (uint i = 1; i <= lastId; i++) {
            if (requests[i].status == RequestStatus.Pending) {
                pendingRequests[index] = requests[i];
                index++;
            }
        }

        return pendingRequests;
    }

    // Admin function to change the status of a request
    function changeRequestStatus(uint id, RequestStatus newStatus) public onlyAdmin {
        Request storage request = requests[id];
        require(request.status == RequestStatus.Pending, "Can only change status of pending requests");
        request.status = newStatus;
    }

    // Close an existing request
    function closeRequest(uint id) public {
        Request storage request = requests[id];
        require(request.status == RequestStatus.Open && (msg.sender == request.author || request.balance >= request.goal), "You cannot close this order");
        request.status = RequestStatus.Closed;
        if (request.balance > 0) {
            uint balance = request.balance;
            request.balance = 0;
            payable(request.author).transfer(balance);
        }
    }

    // Donate to a specific request
    function donate(uint id) public payable notBlacklisted {
        require(msg.value > 0, "Donate must be greater than 0");
        Request storage request = requests[id];
        require(request.status == RequestStatus.Open, "Can only donate to open requests");
        request.balance += msg.value;
        request.totalDonations += msg.value;
        if (request.balance >= request.goal) {
            closeRequest(id);
        }
    }

    // Get a list of open requests starting from a specific ID
    function getOpenRequests(uint startId, uint quantity) public view returns (Request[] memory) {
        require(startId > 0, "Invalid startID");
        require(quantity > 0 && quantity < 30, "Invalid quantity");

        Request[] memory result = new Request[](quantity);
        uint id = startId;
        uint count = 0;

        while (count < quantity && id <= lastId) {
            if (requests[id].status == RequestStatus.Open) {
                result[count] = requests[id];
                count++;
            }
            id++;
        }

        return result;
    }
}