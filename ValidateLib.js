<!--
/*-----------------------------------------------------------------------------
Filename: ValidateLib.js
Author: MWM Consulting, Inc.
http://www.mwmconsulting.biz

Description: Javascript validation functions

Copyright MWM Consulting Inc., May 2008
All Rights Reserved
-----------------------------------------------------------------------------*/

// Function List
// -------------
// ValidateDate					Validates a date form field
// ValidateDateToDate				Validate TO date is later than FROM date
// FormatSQL					Formats SQL statements by replacing "'" or """ with "''"
// isUS_State(sCountry,sState)			Validates US state
// isUS_Zip(sCountry,sZip)			Validates US zip code
// isValidExpDate(sMonth,sYear)			Validates credit card expiration date
// isEmail(sEmail)				Validates e-mail address
// isTelephone(sTelephone)			Validates telephone number
// isNumber(sNumber)				Validates string is a number
// isCurrency(sNumber)				Validates string is a currency
// isWhitespace(sString)			Check whether string is empty or whitespace.
// isValidShipping(sCountry, sShipping)		Check whether shipping method is allowed for country selected
// checkCard(cardType,cardNum)	 		Validates credit card number with credit card type

// Variable Declarations
// ---------------------
var STATES = new Array("al","ak","as","az","ar","ca","co","ct",
   "de","dc","fm","fl","ga","gu","hi","id","il","in","ia","ks",
   "ky","la","me","mh","md","ma","mi","mn","ms","mo","mt","ne",
   "nv","nh","nj","nm","ny","nc","nd","mp","oh","ok","or","pw",
   "pa","pr","ri","sc","sd","tn","tx","ut","vt","vi","va","wa",
   "wv","wi","wy","ae","aa","ae","ae","ae","ap");

var STATE_NAMES = new Array(
   "alabama", "alaska", "american samoa", "arizona", "arkansas",
   "california", "colorado", "connecticut", "delaware",
   "district of columbia", "federated states of micronesia",
   "florida", "georgia", "guam", "hawaii", "idaho", "illinois",
   "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine",
   "marshall islands", "maryland", "massachusetts", "michigan",
   "minnesota", "mississippi", "missouri", "montana", "nebraska",
   "nevada", "new hampshire", "new jersey", "new mexico", "new york",
   "north carolina", "north dakota", "northern mariana islands", 
   "ohio", "oklahoma", "oregon", "palau", "pennsylvania", "puerto rico",
   "rhode island", "south carolina", "south dakota", "tennessee",
   "texas", "utah", "vermont", "virgin islands", "virginia",
   "washington", "west virginia", "wisconsin", "wyoming",
   "armed forces africa", "armed forces americas",
   "armed forces canada", "armed forces europe",
   "armed forces middle east", "armed forces pacific");

// Function Declarations
// ---------------------
// --------------------------------------------------------------------------------
// ValidateDate(indate, field_name, required)
//
// Function to ensure date is in correct format (i.e. dd/mm/yyyy).
// Excepts years in format "yy" but assumes years between and including 90 to 99 to be 1990 to 1999
// Otherwise assumes 2000 (i.e. if "yy" entered is 21 then "yyyy" will be 2021.)
//
// indate = form field containing date to be validated
// field_name = name of form field being validated
// required = boolean value stating whether date is required or not.
// 
//
// Developed by Matthew Marcus
// --------------------------------------------------------------------------------
function ValidateDate(indate, field_name, required) {
	if (indate.value == "") {
		if (required == true) {
			alert("Please enter a date in the " + field_name + " field.");
			indate.select();
			indate.focus();
			return false;
		}
		return true;
	}

	indate.value = indate.value.replace(/-/g, "/");
	indate.value = indate.value.replace(/\./g, "/");

	var re_date = /^(\d+)\/(\d+)\/(\d+)$/;
	
	re_date.exec(indate.value);
	
//    	var chkDate=new Date(Date.parse(indate.value))

	var chkDate=new Date(RegExp.$3, RegExp.$2-1, RegExp.$1);
	var sdate = indate.value.split("/");
	var iMonth=Math.abs(sdate[1]);
	var iDate=Math.abs(sdate[0]);
	var cmpMonth=chkDate.getMonth()+1;
	var sMonth = new String(cmpMonth);
	if (sMonth.length == 1) {
   		sMonth = "0" + sMonth;
	}
	var cmpDate=chkDate.getDate();
	var sDate = new String(cmpDate);
	if (sDate.length == 1) {
   		sDate = "0" + sDate;
	}
  	sYear = new String(Math.abs(sdate[2]));
	chkDate = new Date();
	var cmpYear=chkDate.getFullYear();
	sCurrentYear = new String(cmpYear);
	sCurrentYear = sCurrentYear.substr(0, sCurrentYear.length - sYear.length);
	if (sYear >= "90" && sYear <= "99") {
		sCurrentYear = sCurrentYear - 1;
	}
   	sYear = sCurrentYear + sYear;
	sAll = new String(sDate + "/" + sMonth + "/" + sYear);
	if (sAll.search("NaN") != -1 || (iMonth < 1 || iMonth > 12) || (iDate < 1 || iDate > 31) || (sYear.length != 4)) {
		alert("Please enter a valid date of the form \"Day/Month/4-digit Year\" in the " + field_name + " field.");
		indate.select();
		indate.focus();
		return false;
	}
	indate.value = sAll;
	return true;
}

// --------------------------------------------------------------------------------
// ValidateDateToDate(FromDate, ToDate, FromDateName, ToDateName, DateEquality)
//
// Function to ensure ToDate is later than FromDate.
//
// FromDate = form field containing From Date
// ToDate = form field containing To Date
// FromDateName = name of From Date field
// ToDateName = name of To Date field
// DateEquality = allow dates to be equal (default True)
//
// Developed by Matthew Marcus
// --------------------------------------------------------------------------------
function ValidateDateToDate(FromDate, ToDate, FromDateName, ToDateName, DateEquality) {
	var dFromDate;
	var dToDate;

	if ((DateEquality == "" || DateEquality == null) && DateEquality != false) {
		DateEquality = true;
	}
	
	dFromDate = new Date(FromDate.value);
	dToDate = new Date(ToDate.value);

	if (DateEquality == true) {
		if (dFromDate > dToDate) {
			alert ("Please specify a " + ToDateName + " later than or equal to the " + FromDateName + ".");
			ToDate.select();
			ToDate.focus();
			return false;
		}
	} else {
		if (dFromDate >= dToDate) {
			alert ("Please specify a " + ToDateName + " later than the " + FromDateName + ".");
			ToDate.select();
			ToDate.focus();
			return false;
		}		
	}
	return true;
}

// --------------------------------------------------------------------------------
// FormatSQL(sString, sChoice)
//
// Purpose: To replace "'" or """ with "''" for building proper SQL statement.
//
// Developed by Matthew Marcus
// --------------------------------------------------------------------------------
function FormatSQL(sString, sChoice) {
	var sReturn = "";
	var sExpn;
	
	switch (sChoice){
		case "1":
			sExpn = /'/gi;
			break;
		case "2":
			sExpn = /"/gi;
			break;
	}
	
	if (sString != "")
		sReturn = sString.replace(sExpn, "''");
	
	return sReturn;
}

function isUS_State(sCountry, sState) {
	var bReturn = false;
	
	if (sCountry == "United States") {
		var sStateTemp = sState.toLowerCase();
			
		for (var iCount=0; iCount<STATES.length; iCount++) {
			if (sStateTemp == STATES[iCount]) {
				bReturn = true;
				break;
			}
		}
		
		for (var iCount=0; iCount<STATE_NAMES.length; iCount++) {
			if (sStateTemp == STATE_NAMES[iCount]) {
				bReturn = true;
				break;
			}
		}
	} else {
		bReturn = true;
	}

	return bReturn;
}

// --------------------------------------------------------------------------------
// isUS_Zip(sCountry, sZip)
//
// Purpose: Validate US zip code.
//
// Developed by Matthew Marcus
// Gigolo Software Inc, August 2001
// --------------------------------------------------------------------------------
function isUS_Zip(sCountry, sZip) {
	var bReturn = true;
	var GoodChars = "0123456789-";

	if (sCountry == "United States") {
		if (sZip.length != 5 && sZip.length != 10) {
			bReturn = false;
		} else {
			for (var iCount=0; iCount<sZip.length; iCount++) {
				if (GoodChars.indexOf(sZip.charAt(iCount)) == -1) {
					bReturn = false;
				}
			}
			
		}
	}

	return bReturn;
}

// --------------------------------------------------------------------------------
// isValidExpDate(sMonth, sYear)
//
// Purpose: Validate CC expiration date.
//
// Developed by Matthew Marcus
// Gigolo Software Inc, August 2001
// --------------------------------------------------------------------------------
function isValidExpDate(sMonth, sYear) {
	bReturn = true;
	dtToday = new Date();
	
	if (sYear < dtToday.getFullYear()) {
		bReturn = false;
	} else if (sYear == dtToday.getFullYear() && sMonth < dtToday.getMonth()+1) {
		bReturn = false;
	}
	
	return bReturn;
}

// --------------------------------------------------------------------------------
// isEmail(sEmail)
//
// Purpose: Validate e-mail address.
//
// Developed by Matthew Marcus
// Gigolo Software Inc, August 2001
// --------------------------------------------------------------------------------
function isEmail(sEmail) {
	with (sEmail) {
		apos=value.indexOf("@"); 
		dotpos=value.lastIndexOf(".");
		lastpos=value.length-1;
		if (apos<1 || dotpos-apos<2 || lastpos-dotpos>3 || lastpos-dotpos<2) {
			return false;
		} else {
			return true;
		}
	}
}

// --------------------------------------------------------------------------------
// isTelephone(sTelephone)
//
// Purpose: Validate telephone number.
//
// Developed by Matthew Marcus
// Gigolo Software Inc, August 2001
// --------------------------------------------------------------------------------
function isTelephone(sTelephone) {
	var valid = true
	var GoodChars = "0123456789().-+xX "
	var i = 0
	if (sTelephone=="") {
		// Return false if number is empty
		valid = false
	}
	for (i = 0; i <= sTelephone.length -1; i++) {
		if (GoodChars.indexOf(sTelephone.charAt(i)) == -1) {
			valid = false
		} // End if statement
	} // End for loop
	return valid
}

// --------------------------------------------------------------------------------
// isNumber(sNumber)
//
// Purpose: Validate string is a number.
//
// Developed by Matthew Marcus
// Gigolo Software Inc, September 2001
// --------------------------------------------------------------------------------
function isNumber(sNumber) {
	var valid = true
	var GoodChars = "0123456789."
	var i = 0
	if (sNumber=="") {
		// Return false if number is empty
		valid = false
	}
	for (i = 0; i <= sNumber.length -1; i++) {
		if (GoodChars.indexOf(sNumber.charAt(i)) == -1) {
			valid = false
		} // End if statement
	} // End for loop
	return valid
}

// --------------------------------------------------------------------------------
// isCurrency(sNumber)
//
// Purpose: Validate string is a currency.
//
// Developed by Matthew Marcus
// MWM Consulting, Inc. - October 2007
// --------------------------------------------------------------------------------
function isCurrency(sNumber) {
	var valid;
	var GoodChars = /^-?[0-9][0-9]*(\.\d{2})$/;

	if (sNumber != "" && GoodChars.test(sNumber)) {
		valid = true;
	} else {
		valid = false;
	}
	
	return valid
}

// --------------------------------------------------------------------------------
// isWhitespace(sString)
//
// Purpose: Returns true if sString is empty or nothing but whitespace characters.
//	    False otherwise.
//
// Developed by Matthew Marcus
// Gigolo Software Inc, August 2001
// --------------------------------------------------------------------------------
function isWhitespace(sString) {
	var sStringNew = new String(sString);
	var whitespace = " \t\n\r";
	var i;

	// Is sStringNew empty?
	if (sStringNew == "" || sStringNew == null) return true;
	
	// Search through string's characters one by one
	// until we find a non-whitespace character.
	// When we do, return false; if we don't, return true.
	
	for (i = 0; i < sStringNew.length; i++)
	{   
	// Check that current character isn't whitespace.
	var c = sStringNew.charAt(i);
	
	if (whitespace.indexOf(c) == -1) return false;
	}
	
	// All characters are whitespace.
	return true;
}

// --------------------------------------------------------------------------------
// isValidShipping(sCountry, sShipping)
//
// Purpose: Returns true if shipping method is valid for selected country.
//	    False otherwise.
//
// Developed by Matthew Marcus
// Gigolo Software Inc, August 2001
// --------------------------------------------------------------------------------
function isValidShipping(sCountry, sShipping) {
	bValid = true;
	
	switch (sCountry) {
		case "United States" :
			if (sShipping.indexOf("us") == -1) {
				bValid = false;
			}
			break;
		default :
			if (sShipping.indexOf("international") == -1) {
				bValid = false;
			}
	}
	
	return bValid;
}

function checkCardNumWithMod10(cardNum) {
	var i;
	var cc = new Array(16);
	var checksum = 0;
	var validcc;

	// assign each digit of the card number to a space in the array	
	for (i = 0; i < cardNum.length; i++) {
		cc[i] = Math.floor(cardNum.substring(i, i+1));
	}

	// walk through every other digit doing our magic
	// if the card number is sixteen digits then start at the
	// first digit (position 0), otherwise start from the
	// second (position 1)
	for (i = (cardNum.length % 2); i < cardNum.length; i+=2) {
		var a = cc[i] * 2;
		if (a >= 10) {
			var aStr = a.toString();
			var b = aStr.substring(0,1);
			var c = aStr.substring(1,2);
			cc[i] = Math.floor(b) + Math.floor(c);
		} else {
			cc[i] = a;
		}
	}

	// add up all of the digits in the array
	for (i = 0; i < cardNum.length; i++) {
		checksum += Math.floor(cc[i]);
	}

	// if the checksum is evenly divisble by 10
	// then this is a valid card number
	validcc = ((checksum % 10) == 0);

	return validcc;
}

function cleanCardNum(cardNum) {
	var i;
	var ch;
	var newCard = "";

	// walk through the string character by character to build
	// a new string with numbers only
	if (cardNum.length == 0) {
		alert("Please enter a credit card number.");
		return "";
	}
		
	i = 0;
	while (i < cardNum.length) {
		// get the current character
		ch = cardNum.substring(i, i+1);
		if ((ch >= "0") && (ch <= "9")) {
			// if the current character is a digit then add it
			// to the numbers-only string we're building
			newCard += ch;
		} else {
			// not a digit, so check if its a dash or a space
			if ((ch != " ") && (ch != "-")) {
				// not a dash or a space so fail
				alert("The card number contains invalid characters.");
				return "";
			}
		}
		i++;
	}

	// we got here if we didn't fail, so return what we built
	return newCard;
}

function checkCard(cardType, cardNum) {
	var validCard;
	var cardLength;
	var cardLengthOK;
	var cardStart;
	var cardStartOK;
	
	// check if the card type is valid
	if ((cardType != "visa") && (cardType != "mastercard") && (cardType != "amex") && (cardType != "discover")) {
		alert("Please select a card type.");
		return false;
	}

	// clean up any spaces or dashes in the card number
	validCard = cleanCardNum(cardNum);
	if (validCard != "") {
		// check the first digit to see if it matches the card type
		cardStart = validCard.substring(0,1);
		cardStartOK = ( ((cardType == "visa") && (cardStart == "4")) ||
				((cardType == "mastercard") && (cardStart == "5")) ||
				((cardType == "amex") && (cardStart == "3")) ||
				((cardType == "discover") && (cardStart == "6")) );
		if (!(cardStartOK)) {
			// card number's first digit doesn't match card type
			alert("Please make sure the card number you've entered matches the card type you've selected.");
			return false;
		}

		// the card number is good now, so check to make sure
		// it's a the right length
		cardLength = validCard.length;		
		cardLengthOK = ( ((cardType == "visa") && ((cardLength == 13) || (cardLength == 16))) ||
				 ((cardType == "mastercard") && (cardLength == 16)) ||
				 ((cardType == "amex") && (cardLength == 15)) ||
				 ((cardType == "discover") && (cardLength == 16)) );
		if (!(cardLengthOK)) {
			// not the right length
			alert("Please make sure you've entered all of the digits on your card.");
			return false;
		}

		// card number seems OK so do the Mod10
		if (checkCardNumWithMod10(validCard)) {
			return true;
		} else {
			alert("Please make sure you've entered your card number correctly.");
			return false;
		}
	} else {
		return false;
	}
}

// -->