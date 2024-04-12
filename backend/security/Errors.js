class Errors{
    constructor(theMessage){
        this.error = theMessage;
        this.DisplayError();
    }

    DisplayError(){
        return "You have ran into " + this.error
    }

}


module.exports = Errors;