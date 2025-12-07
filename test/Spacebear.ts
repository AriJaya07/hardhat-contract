import { expect } from "chai";
import hre from "hardhat";

describe("Spacebear", function () {
  async function deploySpacebearAndMintTokenFixture() {
    const connection = await hre.network.connect();
    const Spacebear = await connection.ethers.getContractFactory("Spacebear");
    const spacebearInstance = await Spacebear.deploy();
    const [owner, otherAccount, notTheNFTOwner] =
      await connection.ethers.getSigners();
    await spacebearInstance.safeMint(otherAccount.address);

    return {
      spacebearInstance,
      owner,
      otherAccount,
      notTheNFTOwner,
      connection,
    };
  }

  it("is possible to mint a token", async () => {
    const connection = await hre.network.connect();
    const { spacebearInstance, otherAccount } =
      await connection.networkHelpers.loadFixture(
        deploySpacebearAndMintTokenFixture
      );

    expect(await spacebearInstance.ownerOf(0)).to.equal(otherAccount.address);
  });

  it("fails to transfer tokens from the wrong address", async () => {
    const connection = await hre.network.connect();
    const { spacebearInstance, otherAccount, notTheNFTOwner } =
      await connection.networkHelpers.loadFixture(
        deploySpacebearAndMintTokenFixture
      );

    expect(await spacebearInstance.ownerOf(0)).to.equal(otherAccount.address);

    // The key issue: notTheNFTOwner is trying to transfer FROM otherAccount
    // This should fail because notTheNFTOwner doesn't own the token and isn't approved
    await expect(
      spacebearInstance
        .connect(notTheNFTOwner)
        .transferFrom(otherAccount.address, notTheNFTOwner.address, 0)
    )
      .to.be.revertedWithCustomError(
        spacebearInstance,
        "ERC721InsufficientApproval"
      )
      .withArgs(notTheNFTOwner.address, 0);
  });
});
