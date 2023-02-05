import HoldNumber from "../contracts/HoldNumber.cdc"

transaction(myNewNumber: Integer) {

  prepare(signer: AuthAccount) {}

  execute {
    HoldNumber.changeNumber(newNumber: myNewNumber)
  }
}