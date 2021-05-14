pragma solidity ^0.4.17;
 
 //Contract creation file
 
 contract Lottery{
    
    struct participant {
        address accn;
        string  email;
    }
     
    address public owner;
    uint count;
    string mPrize;
    bool active;
    participant[] public participants;
    participant winner;
     
    constructor( string prize ) public{
        owner = msg.sender;
        mPrize = prize;
        count = 0;
        active = true;
    }
     
    function enter(string vEmail) public{
        participants.push(
            participant( msg.sender, vEmail )    
        );
        count += 1;
    }
     
    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, now )));
    }
    
    function getParticipantsAccn() public view returns( address[] ) {
        address[] memory toRet = new address[]( participants.length );

        for( uint i = 0; i < count; ++i ) {
            toRet[i] =  participants[i].accn;
        }
        return toRet;
    }
    
     
    function pickWinner() public restricted returns(address){
        
        require( active == true );
        
        uint index = random() % participants.length;
        active = false;
        winner = participants[index];
        
        return participants[index].accn;
    }
    
    function getPrize() public view returns( string ) {
        return mPrize;
    }
    
    function isActive() public view returns( bool ) {
        return active;
    }
    
    function getWinnerEmail() public view returns( string ) {
        require( active == false );
        return winner.email;
    }
    
    function getWinnerAccn() public view returns( address ) {
        require( active == false );
        return winner.accn;
    }
    
    modifier restricted(){
        require(msg.sender == owner);
        _;
    }
 
 
 }