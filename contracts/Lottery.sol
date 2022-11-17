// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

contract Lottery {
    address public manager;
    address payable[] public players;
    uint public lotteryId;
    mapping (uint => address payable) public lotteryHistory;

    constructor() {
        manager = msg.sender;
        lotteryId = 1;
    }

    function getWinnerByLottery(uint lottery) public view returns (address payable) {
        return lotteryHistory[lottery];
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function enter() public payable {
        require(msg.value > .01 ether);

        // address of player entering lottery
        players.push(payable(msg.sender));
    }

    function getRandomNumber() public view returns (uint) {
        return uint(keccak256(abi.encodePacked( block.timestamp, block.difficulty, block.gaslimit)));
    }

    function pickWinner() public onlyowner {
        uint index = getRandomNumber() % players.length;
        players[index].transfer(address(this).balance);

        lotteryHistory[lotteryId] = players[index];
        ++lotteryId;
        
        players = new address payable[](0);
    }

    modifier onlyowner() {
      require(msg.sender == manager, "You are not the manager");
      _;
    }
}