import 'datejs';

export class CommonFunction {
    public static b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
    public static loadYearMonths() {
        let monthsYear: any = [];
        var d1 = new Date().addMonths(-12)
        var d2 = new Date().addMonths(12);
        while (d2 > d1) {
            d1 = d1.addMonths(+1);
            monthsYear.push({ text: d1.toString('yyyy-MM'), val: d1.toString('yyyy-MM-dd') });
        }
        return monthsYear;
    }
    public static bindYearMonth(mPast:number, mNext:number) {
        let monthsYear: any = [];
        var d1 = new Date().addMonths(-mPast)
        var d2 = new Date().addMonths(mNext);
        while (d2 > d1) {
            d2 = d2.addMonths(-1);
            monthsYear.push({ text: d2.toString('yyyy-MM'), val: d2.toString('yyyy-MM') });
        }
        return monthsYear;
    }
    public static bindYears(from:number,to:number) {
        let year: any = [];
        var d1 = new Date().addYears(from)
        var d2 = new Date().addYears(to);
        while (d2 > d1) {
            d2 = d2.addYears(-1);
            year.push({ text: d2.toString('yyyy'), val: d2.toString('yyyy') });
        }
        return year;
    }
    public static loadYears(from:number,to:number) {
        let year: any = [];
        var d1 = new Date().addYears(from)
        var d2 = new Date().addYears(to);
        while (d2 > d1) {
            d1 = d1.addYears(+1);
            year.push({ text: d1.toString('yyyy'), val: d1.toString('yyyy-MM-dd') });
        }
        return year;
    }
    /**Eg: 2017-05-30 19:26:04->2017-05-30 */
    public static getDateFromDatetime(sdatetime){
        try{
            return sdatetime.split(" ")[0];
        }
        catch(e){
            return sdatetime;
        }
    } 
    public static formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    public static FormatMoney(number: any, decimal: number = 2) {
        try {
            var n = Number(number).toFixed(decimal);
            return Number(n).toLocaleString('us')
        }
        catch (e) {
            console.error(e);
            return number;
        }
    }
    public static ReloadDataTable(tableClassName: string) {
        try {
            $("." + tableClassName)
                .DataTable()
                .ajax.reload();
        }
        catch (e) {
            console.error(e);
        }
    }
   
    public static pad2(number) {
        return (number < 10 ? '0' : '') + number;
    }

    public static generateId() {
        var letterLeng = 15,
            digitLeng = 5,
            text = "",
            letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            digit = "0123456789";

        for (var i = 0; i < letterLeng; i++) {
            text += letter.charAt(Math.floor(Math.random() * letter.length));
        }

        for (var j = 0; j < digitLeng; j++) {
            text += digit.charAt(Math.floor(Math.random() * digit.length));
        }

        return text;
    }

    public static FormatCurrency(value: any, decimal: number = 2) {
        try {
            var n = Number(value);
            if (isNaN(n)) {
                return 0;
            }
            var result =  Number(n).toFixed(decimal);
            return Number(result);
        }
        catch (e) {
            console.error(e);
            return 0;
        }
    }

    public static formatStringMoneyToInt(money: string) {
        return money ? parseInt(money.replace(',','')) : 0;
    }

    public static removeComma(value: string) {
        return value ? value.replace(new RegExp(',', 'g'), '') : '0';
    }

    // Function compare value object array to sort by 'key'(property object) and 'order'(asceding or descending)
    public static compareValues(key, order = 'asc') {
        return function innerSort(a, b) {
          if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
          }
          const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
          const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return ((order === 'desc') ? (comparison * -1) : comparison);
        };
      }
}
