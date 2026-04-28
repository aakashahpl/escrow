const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow Milestone Contract", function () {
  let Escrow, escrow;
  let buyer, seller, other, voter1, voter2;

  const milestoneAmounts = [ethers.parseEther("1"), ethers.parseEther("2")];

  beforeEach(async function () {
    [buyer, seller, other, voter1, voter2] = await ethers.getSigners();

    Escrow = await ethers.getContractFactory("Escrow");

    escrow = await Escrow.deploy(
      buyer.address,
      seller.address,
      milestoneAmounts,
    );

    await escrow.waitForDeployment();
  });

  it("Seller cannot fund milestone", async function () {
    await expect(
      escrow.connect(seller).fundMilestone(0, {
        value: milestoneAmounts[0],
      }),
    ).to.be.revertedWith("Only buyer can call this function");
  });

  it("Cannot fund twice", async function () {
    await escrow
      .connect(buyer)
      .fundMilestone(0, { value: milestoneAmounts[0] });

    await expect(
      escrow.connect(buyer).fundMilestone(0, { value: milestoneAmounts[0] }),
    ).to.be.revertedWith("Milestone already funded");
  });

  it("Invalid milestone index should revert", async function () {
    await expect(
      escrow.connect(buyer).fundMilestone(99, { value: milestoneAmounts[0] }),
    ).to.be.revertedWith("Invalid milestone index");
  });

  it("Should set correct buyer and seller", async function () {
    expect(await escrow.buyer()).to.equal(buyer.address);
    expect(await escrow.seller()).to.equal(seller.address);
  });

  it("Buyer should fund milestone 0", async function () {
    await escrow
      .connect(buyer)
      .fundMilestone(0, { value: milestoneAmounts[0] });

    const milestone = await escrow.milestones(0);
    expect(milestone.funded).to.equal(true);
  });

  it("Should not allow wrong amount funding", async function () {
    await expect(
      escrow.connect(buyer).fundMilestone(0, {
        value: ethers.parseEther("0.5"),
      }),
    ).to.be.revertedWith("Incorrect amount");
  });

  it("Buyer approves milestone", async function () {
    await escrow
      .connect(buyer)
      .fundMilestone(0, { value: milestoneAmounts[0] });

    await escrow.connect(buyer).approveMilestone(0);

    const milestone = await escrow.milestones(0);
    expect(milestone.approved).to.equal(true);
  });

  it("Seller cannot open dispute if no milestone funded", async function () {
    await expect(escrow.connect(seller).openDispute()).to.be.revertedWith(
      "No funded milestone",
    );
  });

  it("Only seller can open dispute", async function () {
    await escrow
      .connect(buyer)
      .fundMilestone(0, { value: milestoneAmounts[0] });

    await expect(escrow.connect(buyer).openDispute()).to.be.revertedWith(
      "Only seller can call this function",
    );
  });

  it("Buyer/seller cannot vote on dispute", async function () {
    await escrow
      .connect(buyer)
      .fundMilestone(0, { value: milestoneAmounts[0] });
    await escrow.connect(seller).openDispute();

    await expect(escrow.connect(buyer).voteDispute()).to.be.revertedWith(
      "Buyer/seller cannot vote",
    );
    await expect(escrow.connect(seller).voteDispute()).to.be.revertedWith(
      "Buyer/seller cannot vote",
    );
  });

  it("Two votes resolves dispute to seller (transfers full balance)", async function () {
    await escrow
      .connect(buyer)
      .fundMilestone(0, { value: milestoneAmounts[0] });
    await escrow
      .connect(buyer)
      .fundMilestone(1, { value: milestoneAmounts[1] });

    await escrow.connect(seller).openDispute();

    const sellerBalBefore = await ethers.provider.getBalance(seller.address);
    await escrow.connect(voter1).voteDispute();
    await escrow.connect(voter2).voteDispute();

    expect(await escrow.disputeOpen()).to.equal(false);

    const sellerBalAfter = await ethers.provider.getBalance(seller.address);
    expect(sellerBalAfter).to.be.gt(sellerBalBefore);
    expect(await ethers.provider.getBalance(await escrow.getAddress())).to.equal(
      0n,
    );
  });

  it("Refund after 2 days returns full balance to buyer", async function () {
    await escrow
      .connect(buyer)
      .fundMilestone(0, { value: milestoneAmounts[0] });
    await escrow.connect(seller).openDispute();

    await expect(escrow.connect(other).refundAfterTimeout()).to.be.revertedWith(
      "Dispute not expired",
    );

    await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60 + 1]);
    await ethers.provider.send("evm_mine");

    const buyerBalBefore = await ethers.provider.getBalance(buyer.address);
    await escrow.connect(other).refundAfterTimeout();
    expect(await escrow.disputeOpen()).to.equal(false);

    const buyerBalAfter = await ethers.provider.getBalance(buyer.address);
    expect(buyerBalAfter).to.be.gt(buyerBalBefore);
    expect(await ethers.provider.getBalance(await escrow.getAddress())).to.equal(
      0n,
    );
  });

});
