const hre = require("hardhat");

async function main() {
  const [buyer, seller] = await hre.ethers.getSigners();

  console.log("Deploying with buyer:", buyer.address);
  console.log("Seller:", seller.address);

  const milestoneAmounts = [
    hre.ethers.parseEther("1"),
    hre.ethers.parseEther("2"),
  ];

  const Escrow = await hre.ethers.getContractFactory("Escrow");

  const escrow = await Escrow.deploy(
    buyer.address,
    seller.address,
    milestoneAmounts,
  );

  await escrow.waitForDeployment();

  console.log("Escrow deployed to:", await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
