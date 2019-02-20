function formatInputNumberKMB(inputValue) {
    let number = inputValue.match(/^\d*\.?\d*/);
    let decimal = inputValue.match(/^\d+.\d+/);
    if (!(number % 1)) {
        number = number.toString();
        let listAllow = ["k", "m", "b"];
        let numberWord = inputValue.replace(number, "");
        if (numberWord && numberWord.length === 1 && listAllow.indexOf(numberWord.toLowerCase()) !== -1) {
            number = Number(number);
            switch (numberWord.toLowerCase()) {
                case "k":
                    return Math.abs(number) * 1.0e+3;
                case "m":
                    return Math.abs(number) * 1.0e+6;
                case "b":
                    return Math.abs(number) * 1.0e+9;
            }
        }
        else
            return inputValue.replace(/\D/g, '');
    }

    if (decimal) {
        decimal = decimal.toString();
        let listAllow = ["k", "m", "b"];
        let numberWord = inputValue.replace(decimal, "");
        if (numberWord && numberWord.length === 1 && listAllow.indexOf(numberWord.toLowerCase()) !== -1) {
            decimal = parseFloat(decimal);
            switch (numberWord.toLowerCase()) {
                case "k":
                    return Math.abs(decimal) * 1.0e+3;
                case "m":
                    return Math.abs(decimal) * 1.0e+6;
                case "b":
                    return Math.abs(decimal) * 1.0e+9;
            }
        }
        else
            return inputValue.replace(/\D/g, '');
    }

}