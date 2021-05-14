import React, { useState } from "react";
import Web3 from "web3";
import { ContractABI } from "./ContractABI";

import "./App.css";

const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
web3.eth.defaultAccount = web3.eth.accounts[0];
var RemixContract = new web3.eth.Contract(ContractABI, "");
var prize = 0;


function App() {
  const [searchContract, setSearchContract] = useState("");
  const [participant, setParticipants] = useState("");
  const [currContract, setCurrContract] = useState("");
  const [createPrize, setCreatePrize] = useState("");
  const [enterEmail, setEnterEmail ] = useState("");
  const [isActive, setIsActive ] = useState("");
  const [infoWinner, setInfoWinner ] = useState("");
  var tempCreated = JSON.parse(localStorage.getItem("giveawayAdresses"));
  if ( ! tempCreated ) {
    tempCreated = []
  }
  const [localContracts, setLocalContracts] = useState( tempCreated.map((idx) => <li>{idx}</li>) );

  const getContract = async e => {
    e.preventDefault();

    setCurrContract(searchContract);

    RemixContract = new web3.eth.Contract(ContractABI, searchContract);

    var participants = await RemixContract.methods
      .getParticipantsAccn()
      .call();

    prize = await RemixContract.methods
      .getPrize()
      .call();

    var Active = await RemixContract.methods
      .isActive()
      .call();

    if ( Active === false ) {
      var acc = await RemixContract.methods
      .getWinnerEmail()
      .call();

      var email = await RemixContract.methods
      .getWinnerAccn()
      .call();

      setInfoWinner( "Castigator : " + acc + " email: " + email );
    } else {
      setInfoWinner("");
    }

    setIsActive(Active.toString());
    setParticipants(participants.map((idx) => <li>{idx}</li>));

  };

  const getParticipants = async e => {
    var participants = await RemixContract.methods
      .getParticipantsAccn()
      .call();

    setParticipants(participants.map((idx) => <li>{idx}</li>))
  };

  const register = async e => {
    e.preventDefault();

    const accounts = await window.ethereum.enable();
    const account = accounts[0];

    const gas = await RemixContract.methods.enter(enterEmail).estimateGas();
    const result = await RemixContract.methods
      .enter(enterEmail)  
      .send({ from: account, gas });

    console.log(result);
  }

  const createGiveaway = async e => {
    e.preventDefault();
    
    const accounts = await window.ethereum.enable();
    const account = accounts[0];

    const data = '0x' + '608060405234801561001057600080fd5b50604051610e3a380380610e3a83398101806040528101908080518201929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600290805190602001906100899291906100b3565b5060006001819055506001600360006101000a81548160ff02191690831515021790555050610158565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100f457805160ff1916838001178555610122565b82800160010185558215610122579182015b82811115610121578251825591602001919060010190610106565b5b50905061012f9190610133565b5090565b61015591905b80821115610151576000816000905550600101610139565b5090565b90565b610cd3806101676000396000f300608060405260043610610099576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806305b9415d1461009e57806322f3e2d4146100f557806335c1d349146101245780634d98cd06146101fd5780635d495aea1461028d5780635d6ecae6146102e45780638da5cb5b146103505780639d4ff8ad146103a7578063c34f6b0d14610410575b600080fd5b3480156100aa57600080fd5b506100b36104a0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561010157600080fd5b5061010a6104ee565b604051808215151515815260200191505060405180910390f35b34801561013057600080fd5b5061014f60048036038101908080359060200190929190505050610505565b604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b838110156101c15780820151818401526020810190506101a6565b50505050905090810190601f1680156101ee5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b34801561020957600080fd5b506102126105f0565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610252578082015181840152602081019050610237565b50505050905090810190601f16801561027f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561029957600080fd5b506102a26106b7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102f057600080fd5b506102f9610864565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b8381101561033c578082015181840152602081019050610321565b505050509050019250505060405180910390f35b34801561035c57600080fd5b5061036561094d565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103b357600080fd5b5061040e600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610972565b005b34801561041c57600080fd5b50610425610a44565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561046557808201518184015260208101905061044a565b50505050905090810190601f1680156104925780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6000801515600360009054906101000a900460ff1615151415156104c357600080fd5b600560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000600360009054906101000a900460ff16905090565b60048181548110151561051457fe5b90600052602060002090600202016000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806001018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105e65780601f106105bb576101008083540402835291602001916105e6565b820191906000526020600020905b8154815290600101906020018083116105c957829003601f168201915b5050505050905082565b606060001515600360009054906101000a900460ff16151514151561061457600080fd5b60056001018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106ad5780601f10610682576101008083540402835291602001916106ad565b820191906000526020600020905b81548152906001019060200180831161069057829003601f168201915b5050505050905090565b6000806000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561071557600080fd5b60011515600360009054906101000a900460ff16151514151561073757600080fd5b600480549050610745610ae6565b81151561074e57fe5b0690506000600360006101000a81548160ff02191690831515021790555060048181548110151561077b57fe5b906000526020600020906002020160056000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018201816001019080546001816001161561010002031660029004610819929190610b7b565b5090505060048181548110151561082c57fe5b906000526020600020906002020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1691505090565b606080600060048054905060405190808252806020026020018201604052801561089d5781602001602082028038833980820191505090505b509150600090505b600154811015610945576004818154811015156108be57fe5b906000526020600020906002020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1682828151811015156108fe57fe5b9060200190602002019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250508060010190506108a5565b819250505090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460408051908101604052803373ffffffffffffffffffffffffffffffffffffffff168152602001838152509080600181540180825580915050906001820390600052602060002090600202016000909192909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506020820151816001019080519060200190610a2d929190610c02565b505050506001806000828254019250508190555050565b606060028054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610adc5780601f10610ab157610100808354040283529160200191610adc565b820191906000526020600020905b815481529060010190602001808311610abf57829003601f168201915b5050505050905090565b6000444260405160200180838152602001828152602001925050506040516020818303038152906040526040518082805190602001908083835b602083101515610b455780518252602082019150602081019050602083039250610b20565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902060019004905090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610bb45780548555610bf1565b82800160010185558215610bf157600052602060002091601f016020900482015b82811115610bf0578254825591600101919060010190610bd5565b5b509050610bfe9190610c82565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610c4357805160ff1916838001178555610c71565b82800160010185558215610c71579182015b82811115610c70578251825591602001919060010190610c55565b5b509050610c7e9190610c82565b5090565b610ca491905b80821115610ca0576000816000905550600101610c88565b5090565b905600a165627a7a723058203300d67cbe2c462139dbcfb7e3b22602bbfe587d7234154bc5e7e8e7c14367110029'

    // Deploy
    const Contract = new web3.eth.Contract(ContractABI);
    Contract.deploy({data, arguments: [createPrize]})
    .send({
        from: account,
        gas: 4700000
    })
    .on('error', function (error) { console.log('error: ', error) })
    .then(function (newContract) {
        const address = newContract.options.address;  

        var alreadyStored = JSON.parse( localStorage.getItem("giveawayAdresses") );
        if ( alreadyStored ) {
          alreadyStored.push(address);
        } else {
          alreadyStored = [];
        }

        localStorage.setItem("giveawayAdresses", JSON.stringify(alreadyStored));
        setLocalContracts(alreadyStored.map((idx) => <li>{idx}</li>));

        console.log('address:', address)
    });
  }

  const pickWinner = async e => {
    e.preventDefault();

    const accounts = await window.ethereum.enable();
    const account = accounts[0];

    var tt = await RemixContract.methods
    .pickWinner()
    .send( {from : account} );
  }

  return (
    <div className="App" >
      <header className="App-header">

        <div className="splitScreen" >

          {/* Partea in care afisam informatii despre contract */}
          <div className="topPane">

            <h1>Cauta contract</h1>
            <form onSubmit={getContract} >
              <label>
                <input
                  placeHolder="adresa contract"
                  type="text"
                  name="message"
                  value={searchContract}
                  onChange={e => setSearchContract(e.target.value)}
                />
              </label>
              <input type="submit" value="Cauta" />
            </form>
            <li> {currContract} </li> 
            <br/>
            <li> <u> PREMIU </u>  {prize} </li>
            <br/>
            <li> Active : {isActive} </li>
            <br/>
            <li>{infoWinner}</li>
            <br/>

          </div>



          {/*partea in care aratam informatii despre contractul setat */}
          <div className="secondTopPane">

            <h1>Informatii contract</h1>
            <form onSubmit={register}>
                <label>
                  <input
                    placeHolder="email"
                    className="smallBox"
                    type="text"
                    name="enterEmail"
                    value={enterEmail}
                    onChange={e => setEnterEmail(e.target.value)}
                  />
                </label>
                <input type="submit" value="Inscriere" className="smallBox"/>
              </form>

              <button onClick={getParticipants} type="button"> Arata participantii </button>
              <button onClick={pickWinner} type="button" >Alege castigator</button>
              <ul> {participant} </ul>

          </div>

          {/*partea in care apare optiunea de a crea un nou contract*/}
          <div className="bottomPane">
            
            <h1>Creaza giveaway</h1>
            <form onSubmit={createGiveaway}>
                <label>
                  <input
                    placeHolder="premiu ..."
                    type="text"
                    name="message"
                    value={createPrize}
                    onChange={e => setCreatePrize(e.target.value)}
                  />
                </label>
                <input type="submit" value="Creaza" />
              </form>

              {localContracts}

          </div>


        </div>
      </header>
    </div>
  );
}

export default App;