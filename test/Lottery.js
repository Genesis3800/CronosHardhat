const { expect } = require("chai");
const hre = require("hardhat");

describe("Lottery", function () {

  let owner, player1, player2, lottery;

  before( async () => {

    [owner, player1, player2] = await ethers.getSigners();  
    const Lottery = await hre.ethers.getContractFactory("Lottery");
    console.log("Deploying Contract for testing.......")
    lottery = await Lottery.deploy();
    await lottery.deployed();
  });

    it("Display owner and lottery ID correctly", async function () {

      const managerAddress = await lottery.manager();
      console.log("manager from contract is : ", managerAddress);
      expect(await managerAddress).to.equal(owner.address);
    });


    it("Testing getRandomNumber() function", async function () {

     const random = await lottery.getRandomNumber();
     console.log("The winning index in Test number 2 is: ", random%7); 
    });

    it("Player 1 should be 1st participant", async function () {

      await lottery.connect(player1).enter({value: ethers.utils.parseEther("2.0")});
      let participant1 = await lottery.players(0);
      player1Balance = await ethers.provider.getBalance(player1.address);
      console.log("Remaining ETH with player1: ", player1Balance/(10**18) );
      expect(participant1).to.equal(player1.address);
     });

    it("Player 2 should be 2nd participant", async function () {

      await lottery.connect(player2).enter({value: ethers.utils.parseEther("3.0")});
      let participant2 = await lottery.players(1);
      player2Balance = await ethers.provider.getBalance(player2.address);
      console.log("Remaining ETH with player2: ", player2Balance/(10**18));
      expect(participant2).to.equal(player2.address);
     });

     it("pickWinner() function should not be called by non-owner", async function () {

      expect(lottery.connect(player1).pickWinner()).to.be.revertedWith("You are not the manager");
     });

     it("pickWinner() function should work correctly", async function () {
      
      let OldLotteryId = await lottery.lotteryId();
      lottery.pickWinner();
      let NewLotteryId = await lottery.lotteryId();

      console.log("Winner is: ", await lottery.lotteryHistory(NewLotteryId));
      console.log("Old lottery id: ", OldLotteryId.toNumber());
      console.log("New lottery id: ", NewLotteryId.toNumber());


      expect(lottery.connect(player1).pickWinner()).to.be.revertedWith("You are not the manager");
     });



  });