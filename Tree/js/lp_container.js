/*
Copyright 2017 Leister Productions, Inc.
Developed by Mark Harrison
*/


window.addEventListener('click',function(clickEvent){hideMenuOnCorT(clickEvent);}); //click event
window.addEventListener('touchstart',function(clickEvent){hideMenuOnCorT(clickEvent);}); //touch event
window.onresize = resetMenuOnMQChange;
var data = null;

//if we don't have a startsWith function, define one.
if(typeof String.prototype.startsWith !== "function")
	{
  	String.prototype.startsWith = function( str )
  		{
    	return str.length > 0 && this.substring( 0, str.length ) === str;
  		}
	}


function toggleDiv(id)
	{
	var thisDiv = document.getElementById(id);
	if(thisDiv.style.display == 'block')
		{
		thisDiv.style.display = 'none';
		}
		else
		{
		thisDiv.style.display = 'block';
		}
	return false;
	}

function resetMenuOnMQChange()
	{
	if(window.matchMedia("all and (min-width: 769px)").matches)
		{
		document.getElementById("menu").getElementsByTagName("ul")[0].style.width = "";
		}
	else if(document.getElementById("search").style.visibility == "visible")
		{
		document.getElementById("ddmenuspan").style.display = "none";
		document.getElementById("pTitle").style.display = "none";
		document.getElementById("menu").style.visibility = "";
		}
	}

function hideMenuOnCorT(event)
	{//hide menu on click or touch outside of menu
	if( !(document.getElementById("ddmenuspan").contains(event.target)) && window.getComputedStyle(document.getElementById("dDMButton"),null).visibility == "visible")
		{//clear styles set in JS, forcing fallback to CSS style file
		document.getElementById("menu").getElementsByTagName("ul")[0].style.width = "";
		}

	scViews = document.getElementsByClassName("scView");

	if(scViews.length > 0)
		{//don't excute any further code if there are no scViews
		showSCs = document.getElementsByClassName("showSC");

		for(var i=0;i<scViews.length;i++)
			{
			if( !( showSCs[i].contains(event.target) ) && scViews[i].style.display == 'block' && !(scViews[i].contains(event.target)))
				{
				scViews[i].style.display = '';
				}
			}
		}
	}

function showDDMenu()
	{
	if(!(window.matchMedia("all and (min-width: 769px)").matches))
		{
		if(document.getElementById("menu").getElementsByTagName("ul")[0].style.width == "")
			{//set width of the menu ul element so that it shows
			document.getElementById("menu").getElementsByTagName("ul")[0].style.width = "200px";
			}
		else
			{//clear menu ul element width so it hides
			document.getElementById("menu").getElementsByTagName("ul")[0].style.width = "";
			}
		}
	}

//function for padding numbers in the url with 0's
function padNum(number, length)
	{
    while (number.length < length)
    	{
        number = "0" + number;
    	}
    return number;
	}

function showSearch()
	{
	var matchesMediaQ = window.matchMedia("(min-width: 769px)").matches;

	if(document.getElementById("search").style.visibility == "visible")
		{//clear styles set in JS, forcing fallback to CSS style file
		if(matchesMediaQ)
			{
			document.getElementById("menu").style.visibility = "";
			}
		else
			{
			//uncomment this next line if we want the menu to re-open when closing a search.
/* 			document.getElementById("menu").getElementsByTagName("ul")[0].style.width = "200px"; */
			document.getElementById("pTitle").style.display = "";
			}

		document.getElementById("ddmenuspan").style.display = "";
		document.getElementById("search").style.visibility = "";
		document.getElementById("tableBorder").style.visibility = "";
		//clear search box and clear results
		document.getElementById("searchBox").value = "";
		document.getElementById("results").innerHTML = "";
		}
	else
		{
		if(matchesMediaQ)
			{
			document.getElementById("menu").style.visibility = "hidden";
			}
		else
			{
			document.getElementById("menu").getElementsByTagName("ul")[0].style.width = "";
			document.getElementById("ddmenuspan").style.display = "none";
			document.getElementById("pTitle").style.display = "none";
			}

		document.getElementById("search").style.visibility = "visible";
		document.getElementById("searchBox").focus();

		setTimeout(function(){data = loadNamesJSON()},200);
		}
	}

function loadNamesJSON()
	{
	var jData = null;

	if(sessionStorage.getItem("wpIndex"))
		{
		jData = JSON.parse(sessionStorage.getItem('wpIndex'));
		}
	else
		{
		var jsonhttp = new XMLHttpRequest();

		var jsonLocation = rootLocation + "index.json";
		jsonhttp.open("GET",jsonLocation,false);
		jsonhttp.send();

		jData = JSON.parse(jsonhttp.response);

		try
			{//check to make sure the browser has enough storage
			sessionStorage.setItem("wpIndex",jsonhttp.response)
			}
		catch (error)
			{//if the browser doesn't have enough storage we don't store the json file
			if (error.name === 'QuotaExceededError')
				{
				console.log("Not enough room in session storage");
				}
			}
		}

    return jData;
	}

/*
JSON file field structure:
	id -> person id number, same as in the family file
	key -> field to search for names, forced to UPPERCASE
	sex -> ‘m’ or ‘f’
	name -> name of the person for display
	dates -> birth - death dates of the person for display
	url -> relative location of this person in the web project
*/

function searchArray(string,data)
	{
	var results = [];
	//w/wc = webcard; r/rr = register report; a/at = ancestor report; d/dr = descendant report; g/fg = family group; p/ps = person sheet; h/fh = family history report
	var linkTypes = {w:"wc", r:"rr", a:"at", d:"dr", g:"fg", p:"ps", h:"fh", W:"WC", R:"RR", A:"AT", D:"DR", G:"GF", P:"PS", H:"FH" };

	if(string == "")
		{//if no string, output nothing
		results=null;
		//and hide the table
		//hideElement("tableBorder");
		document.getElementById("tableBorder").style.visibility = "";
		}
	else
		{//if string, find entries contain said string
		string = string.toUpperCase().replace(/,/g,"").normalize('NFD').replace(/[\u0300-\u036f]/g, ""); //make string uppercase, remove commas, remove diacritics (normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
		for(var entryIterator=0; entryIterator<data.length; entryIterator++)
			{
			var thisEntry = data[entryIterator];

			if(!isNaN(string))
				{//if the string can be caste as a number, search the ID field.
				if(thisEntry["i"] == string)
					{
					results.push(thisEntry);
					}
				}
			else
				{//new method comparing 1-1, 1-2, 1-3, 2-1, 2-2, 2-3, etc.
				var stringArray = string.split(/[ ]+/).filter(Boolean);
				var keyArray = thisEntry["k"].toUpperCase().split(/[ ]+/).filter(Boolean);
				var matches = 0;

				for(var strElementIterator = 0; strElementIterator < stringArray.length; strElementIterator++)
					{

					var elementMatches = 0;

					for (var keyElementIterator = 0; keyElementIterator < keyArray.length; keyElementIterator++)
						{
						if(keyArray[keyElementIterator].startsWith(stringArray[strElementIterator]))
							{
							elementMatches++;
							/* console.log("found element match"); */
							}
						}

					if(elementMatches > 0)
						{//if there are element matches, increase the matches count.
						matches++;
						}
					else if(strElementIterator == 0)
						{//if we get through the first string element and there are no matches, stop looking.
						break;
						}

					}

				if(matches == stringArray.length)
					{//if we have as many matches as elements of the search string, add this entry.
					results.push(thisEntry);
					}
				}
			}
		}

	var tableHTML = "";

	if(results!=null)
		{
		if(results.length>0)
			{
			for(var iterator=0; iterator<results.length; iterator++)
				{//build the HTML for the table from the results

                var thisResult = results[iterator];
				var urlKey;
				var sex;
                var name;
 				var url;

				if("u" in thisResult)
					{
					urlKey = "u";
					url = rootLocation;
					// url = "../";
					}
				else
					{
					urlKey = "v";
					url = "./";
					}

				if("f" in thisResult)
				    {
				    sex = "f";
				    name = thisResult["f"];
				    }
				else if("m" in thisResult)
				    {
				    sex ="m"
				    name = thisResult["m"];
				    }
				else if("n" in thisResult)
				    {
				    sex = "u";
				   	name = thisResult["n"];
				    }
				else
					{
					sex = "u";
					name = "Error: entry missing name";
					}

                var pageType = thisResult[urlKey].charAt(0);
                var pageID = null;
                var anchorID = null;
                var alternatePID = null;

                if(pageType == "h" || pageType == "d" || pageType == "a")
                	{

                	splitUKey = thisResult[urlKey].split("-");
					pageID = splitUKey[0].substring(1,splitUKey[0].length);
					anchorID = splitUKey[1];

					if(splitUKey.length == 3)
						{
						alternatePID = splitUKey[2];
						}

                	/*var locOfDash = thisResult[urlKey].indexOf("-");
                	pageID = thisResult[urlKey].substring(1,locOfDash);
                	anchorID = thisResult[urlKey].substring(locOfDash+1);*/
                	}
                else
                	{
                	pageID = thisResult[urlKey].substring(1);
                	if(pageType == "r")
                		{
                		anchorID = thisResult["i"];
                		}
                	}

				var splitNum = (~~(pageID/500))+1;
				var pageNum = /* (~~(pageID/500)).toString() + */ (pageID % 500).toString();

                //w/wc = webcard; r/rr = register report; a/at = ancestor report; d/dr = descendant report;
                //g/fg = family group; p/ps = person sheet; h/fh = family history report

				//url += linkTypes[pageType];

				var paddedSplit = padNum(splitNum.toString(), 2);
				if(urlKey == "u")
					{
					url += linkTypes[pageType] + paddedSplit + "/";
					}
				url += linkTypes[pageType] + paddedSplit + "_" + padNum(pageNum, 3) + ".html";
			//Register: #P[Person ID]
			//Family History: #P[Person ID]F[Family ID]
			//Descendant Report: #P[Person ID]F[Family ID]
			//Ancestor Report: #P[Ahnentafel Number]
				if(anchorID != null)
					{
					url += "#P";
					if(pageType == "h" || pageType == "d")
						{
						 url+= ( (alternatePID == null) ? thisResult["i"] : alternatePID  ) + "F";
						/* url+= thisResult["i"] + "F"; */
						}
					url += anchorID;
					}

				if(pageType === pageType.toUpperCase())
					{
					url = url.toUpperCase();
					}

				tableHTML += "<tr><td class=\""+sex+"\"><a href=\""+url+"\" onclick=\"showSearch();\">"+name+"</a> "+( ("d" in thisResult) ? thisResult["d"] : "" )+"</td></tr>";
				}
			}
		else
			{
			tableHTML = "<tr><td><i>No Results.</i></td></tr>"
			}
		document.getElementById("tableBorder").style.visibility = "visible";
		//showElement("tableBorder");
		}

	document.getElementById("results").innerHTML = tableHTML; //shove the HTML into the table.
	}
