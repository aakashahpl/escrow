const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow Milestone Contract", function () {
  let Escrow, escrow;
  let buyer, seller, other;

  const milestoneAmounts = [ethers.parseEther("1"), ethers.parseEther("2")];

  beforeEach(async function () {
    [buyer, seller, other] = await ethers.getSigners();

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

  it("Seller cannot fund milestone", async function () {
    await expect(
      escrow.connect(seller).fundMilestone(0, {
        value: milestoneAmounts[0],
      }),
    ).to.be.revertedWith("Only buyer can call this function");
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

});
