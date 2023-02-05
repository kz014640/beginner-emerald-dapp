 pub contract HoldNumber {

    pub var number: Integer

    pub fun changeNumber(newNumber: Integer) {
        self.number = newNumber
    }

    init() {
        self.number = 10
    }
}