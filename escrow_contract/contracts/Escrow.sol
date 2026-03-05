// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {

    address public buyer;
    address public seller;

    struct Milestone {
        uint256 amount;
        bool funded;
        bool approved;
        bool released;
    }

    Milestone[] public milestones;

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this function");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this function");
        _;
    }

    constructor(
        address _buyer,
        address _seller,
        uint256[] memory _amounts
    ) {
        require(_buyer != address(0), "Invalid buyer");
        require(_seller != address(0), "Invalid seller");
        require(_amounts.length > 0, "At least one milestone required");

        buyer = _buyer;
        seller = _seller;

        for (uint256 i = 0; i < _amounts.length; i++) {
            require(_amounts[i] > 0, "Milestone amount must be > 0");

            milestones.push(
                Milestone({
                    amount: _amounts[i],
                    funded: false,
                    approved: false,
                    released: false
                })
            );
        }
    }

    // Buyer calls this to fund a milestone before work starts
    function fundMilestone(uint256 index) public payable onlyBuyer {
        require(index < milestones.length, "Invalid milestone index");

        Milestone storage m = milestones[index];

        require(!m.funded, "Milestone already funded");
        require(msg.value == m.amount, "Incorrect amount");

        m.funded = true;
    }

    // Buyer calls this to approve a milestone after verifying the work is done and automatically relases 
  function approveMilestone(uint256 index) public onlyBuyer {
    require(index < milestones.length, "Invalid milestone index");

    Milestone storage m = milestones[index];

    require(m.funded, "Milestone not funded");
    require(!m.approved, "Milestone already approved");
    require(!m.released, "Milestone already released");

    m.approved = true;
    m.released = true;

    (bool success, ) = payable(seller).call{value: m.amount}("");
    require(success, "Transfer failed");
}

    // Helper view off-chain function to check if all milestones are complete
    function isComplete() public view returns (bool) {
        for (uint256 i = 0; i < milestones.length; i++) {
            if (!milestones[i].released) {
                return false;
            }
        }
        return true;
    }
}