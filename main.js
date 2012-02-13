// JavaScript Document
var str = "<div id='!ID!' class='phone'><p id='header'>Nokia !PHONENO! Phone</p><p id='subheader'>Tri Band</p><p class='footer'>$339.00</p><img id='phoneimage' src='pics/!PIC!.gif' /><div class='tileMenuHolder'><div class='smallButton' id='!CARTID!'><img src='pics/icon_cart_empty.png' class='tileMenuCart'/></div><div class='smallButton' id='!COMPAREID!'><img src='pics/icon_compare.png' class='tileMenuCompare'/></div><div class='smallButton' id='!DETAILID'><img src='pics/icon_details.png' class='tileMenuDetails'/></div></div><p class='detail' id='details' style:'display:'none''>Loern ipsum Loern ipsum ki Loern ipsum ki Loern ipsum Loern ipsum</p></div></div>";
$(document).ready(function(e) 
{
	$('#slider').slider({
					range: false,
			min: 0,
			max: 6,
			values: [0],
			slide: function( event, ui ) 
			{
				//console.log("sliding..."+ui.values[0]);
				doFade(ui.values[0]);
			},
			change: function(event, ui)
			{
				//console.log("Changing...");
				doFiltering(ui.values[0]);
			}
			
	});
    init();
});
function init()
{
	//initRange();
	acceptDragDrop();
	constructItems();
	layoutItems(itemsArray);
	

}
function acceptDragDrop()
{
	   $("#cart").droppable({
                        drop: function(event,ui){
                                        console.log("Item was Dropped");
                                        //$(this).append($(ui.draggable).clone());
										addCartItem(ui.draggable[0].id.split("d")[1]);
                                }
       });
	    $("#comparer").droppable({
                        drop: function(event,ui){
                                        console.log("Item was Dropped to compare");
                                        //$(this).append($(ui.draggable).clone());
										//addCartItem(ui.draggable[0].id.split("d")[1]);
										addCompareItem(ui.draggable[0].id.split("d")[1]);
                                }
       });
}
function addCartItem(id)
{
	var item = parseInt(id)+1;
	var pic = "p"+parseInt(item);
	var title = "Nokia d"+(item-1)+" Phone";
	var exists = document.getElementById("ci"+item);
	console.log(exists);
	if(!exists)
	{
		$("#cart").append("<div class='cartItem' id='ci"+item+"'><div class='cartItemDelete' id='del"+(item)+"'><img 	src='pics/trashcan.png'/></div><img src=pics/"+pic+".gif class='smallPhone'/><p class='cartItemTitle'>"+ title+"</p><p class='cartItemPrice'>$339.00</p><input type='text' id='ip"+item+"' class='cartItemQuantity' value='1'/></div>");
	$("#del"+(item)).bind("click",onDeleteFromCart);
	}
	else
	{
		value = document.getElementById("ip"+item).value;
		console.log("valie "+value);
		document.getElementById("ip"+item).value = parseInt(value)+1;
	
	}
}
var compareItemList = new Array();
function addCompareItem(id)
{
	if(compareItemList.length < 4)
	{
		
		
		var item = parseInt(id)+1;
		compareItemList.push(parseInt(id));
		var pic = "p"+parseInt(item);
		var title = "Nokia d"+(item-1)+" Phone";
		var exists = document.getElementById("co"+item);
		console.log(exists);
		if(!exists)
		{
			$("#comparer").append("<div class='compareItem' id='co"+item+"'><div class='cartItemDelete' id='compdel"+(item)+"'><img 	src='pics/trashcan.png'/></div><img src=pics/"+pic+".gif class='smallPhone'/><p class='cartItemTitle'>"+ title+"</p><p class='compareItemPrice'>$339.00</p></div>");
		$("#compdel"+(item)).bind("click",onDeleteFromCompare);
		}
		else
		{
			/*value = document.getElementById("ip"+item).value;
			console.log("valie "+value);
			document.getElementById("ip"+item).value = parseInt(value)+1;*/
		
		}
	}
}
function onDeleteFromCart(event)
{
	console.log("To delete "+event.currentTarget.id);
	var id = event.currentTarget.id.split("del")[1];
	var divid = "#ci"+id;
	console.log(divid);
	$(divid).remove();
}
function onDeleteFromCompare(event)
{
	var id = event.currentTarget.id.split("compdel")[1];
	var divid = "#co"+id;
	$(divid).remove();
	for(var i=0; i<compareItemList.length; i++)
	{
		if(compareItemList[i] == id-1)
		{
			compareItemList.splice(i,1);
		}
	}
}
function initRange()
{
	//console.log("Range");
	$(":range").rangeinput(
	{
		onSlide: function(e, i)  
		{
			//console.log("value "+i);
			doFade(i);
		},
		progress: true,
		value: 0,

		change: function(e, i) 
		{
			doFiltering(i);
		},

		speed: 2

	});
}

var numCols = 4;
var tileWidth = 150;
var tileHeight = 110;
var totalItems = 20;
var firstRender = true;
var itemsArray = new Array();
var itemsInViewArray = new Array();
var tweenCounter = 0;
var operation = "remove"
var changedItems = new Array();
var prev = 0;
var tribandFilteredItems;
var sliderArray = [
					{value:1, covered: [0]},
					{value:2, covered: [1]},
					{value:3, covered: [2,3,4]},
					{value:5, covered: [5,6,7]},
					{value:6, covered: [8,9,10]}
				  ];
var slideFaderArray = new Array();
var operationChanged = false;
var addBackArray = new Array();
var toRemoveArray = new Array();
function doFade(index)
{
	//console.log(index +" boom  "+prev);
	if(index >= prev)
	{
		//console.log("Remove condition");
		if(!operationChanged)
		{
			//console.log("reset changed items");
			//changedItems = new Array();
			operationChanged = true;
		}
		direction = "remove";
	}
	else
	{
		direction = "add";
		operationChanged = false;

	}
	//console.log("direction "+direction);
	if(direction == "add")
	{
		//console.log("slider value "+index);
		if(index < sliderArray.length)
		{
			for(var i=index; i<sliderArray.length; i++)
			{
				//addedItems = sliderArray[i].covered;
				//console.log("Items to come in: "+sliderArray[i].covered);
				addBackArray = addBackArray.concat(sliderArray[i].covered);
			}
		}
		changedItems = removeDuplicateElement(addBackArray);
		
	}
	else
	{
		for(var i=0; i<sliderArray.length; i++)
		{
			//console.log(sliderArray[i].value+"  "+index);
			if(index >= sliderArray[i].value)
			{
				
				//toRemoveArray = sliderArray[i].covered;
				toRemoveArray = toRemoveArray.concat(sliderArray[i].covered);
				
			
				//console.log("to remove: "+removeDuplicateElement(toRemoveArray));
				toRemoveArray = removeDuplicateElement(toRemoveArray);
				changedItems = toRemoveArray;
				

				//break;
			}
		}
		console.log("Triggerig fade for "+toRemoveArray+"in "+itemsInViewArray);
		fadeOut(toRemoveArray, 0);
	}
	

	//prev = index;
	//changedItems = removeDuplicateElement(changedItems);
	console.log("--> Direction "+direction+"  "+changedItems.sort(sortNumeric));
}
function sortNumeric(a, b)
{
	return (a - b) //causes an array to be sorted numerically and ascending
}
 function removeDuplicateElement(arrayName)
 {
  	var newArray=new Array();
  	label:for(var i=0; i<arrayName.length;i++ )
 	{  
  		for(var j=0; j<newArray.length;j++ )
  		{
  			if(newArray[j]==arrayName[i]) 
			{
  				continue label;
			}
  		}
  		newArray[newArray.length] = arrayName[i];
 	 }
 	 return newArray;
}
function doFiltering(index)
{
	if(index > prev)
	{
		//console.log("Sending "+changedItems);
		fadeOut(changedItems, 0);
		removeItems(changedItems);
		//turnOnTriband(changedItems);
		toRemoveArray = new Array();
	}
	else
	{
		//addedItems = changedItems;
		addItems(removeDuplicateElement(changedItems));
		//compareAndAdd(changedItems);
		addBackArray = new Array();
		toRemoveArray = new Array();

		
	}
	operationChanged = true;
	prev = index;
}
function constructItems()
{
	for(var i =0; i<totalItems; i++)
	{
		itemsArray.push(i);
	}
}
var tileSizeChanged = false;
function layoutItems(input)
{
	
	 input = removeDuplicateElement(input);
	 console.log("-----------------------------"+input);
	 if(input.length < 6)
	 {
		 tileWidth = 200;
		 tileHeight = 200;
		 numCols = 3;
		 tileSizeChanged = true;
	 }
	 else
	 {
		 tileWidth = 150;
		 tileHeight = 110;
		 numCols = 4;
		 tileSizeChanged = false;
	 }
	 
	 itemsInViewArray = input
	 changedItems = input;
	 var row = 0;
	 var col = -1;
	 for(var i =0 ; i< input.length; i++)
	 {
		
		col++;
        if (col > numCols - 1)
        {
             row++;
             col = 0;
        } 
		var xTo = (col * (tileWidth + 10));
		var yTo = (row * (tileHeight + 10));
		//console.log("d"+input[i]+" x: "+xTo+" y: "+yTo);
		
		if(firstRender)
		{
			var appendStr = str.split("!ID!").join("d"+input[i]);
			appendStr = appendStr.split("!PIC!").join("p"+(input[i]+1));
			appendStr = appendStr.split("!PHONENO!").join("d"+input[i]);
			appendStr = appendStr.split("!CARTID!").join("cart"+input[i]);
			appendStr = appendStr.split("!COMPAREID!").join("compare"+input[i]);
			$("#holder").append(appendStr);
			$("#d"+input[i]).css("left", xTo);
			$("#d"+input[i]).css("top", yTo);
			$("#d"+input[i]).css("width", tileWidth);
			$("#d"+input[i]).css("height", tileHeight);
			$("#d"+input[i]).bind("mouseover", input[i], onItemMouseOver);
			$("#d"+input[i]).bind("mouseout",input[i], onItemMouseOut, input[i]);
			$("#d"+input[i]).draggable(
											{
											 helper:"clone",
											 appendTo: "#cart"
											}
										);
			$("#cart"+input[i]).bind("click", onCartItemClick);
			$("#compare"+input[i]).bind("click", onCompareItemClick);
			
		}
		var op = parseInt($("#d"+input[i]).css("opacity"));
		if(op == 0)
		{
			//$("#d"+input[i]).css("left", -100);
			//$("#d"+input[i]).css("top", -100);

		}
		var xFrom = parseInt($("#d"+input[i]).css("left"));
		var yFrom = parseInt($("#d"+input[i]).css("top"));
		$("#d"+input[i]).css("width", tileWidth);
		$("#d"+input[i]).css("height", tileHeight);

		
		//console.log("Moving: d"+input[i]+"from  x,y  ("+xFrom+ ","+yFrom+ ") to x,y ("+xTo+","+yTo+")");
		performTween(input[i], xFrom, yFrom, xTo, yTo);
		//
		//itemsArray.push(i);
	 }
	 firstRender = false;
	 console.log("currently out of view are: "+createItemsToRemove(itemsArray, itemsInViewArray));
	 outOfView = createItemsToRemove(itemsArray, itemsInViewArray);

}
var outOfView = new Array()
function onCartItemClick(event)
{
	console.log("cart item "+event.currentTarget.id);
	var item = event.currentTarget.id.split("cart")[1];
	moveLeft();
	addCartItem(item);
}
function onCompareItemClick(event)
{
	console.log("cart item "+event.currentTarget.id);
	var item = event.currentTarget.id.split("compare")[1];
	moveRight();
	addCompareItem(item);
}
function onItemMouseOver(event)
{
	//console.log("Mouse Over" +event.data);
	var ch = $("#d"+event.data).children("div.tileMenuHolder");
	//console.log("CGH "+ch);
	ch.addClass("smallButtonVisible");
}
function onItemMouseOut(event)
{
	//console.log("Mouse Out"+ event.data);
	var ch = $("#d"+event.data).children("div.tileMenuHolder");
	//console.log("CGH "+ch);
	ch.removeClass("smallButtonVisible");
}
function performTween(i, xFrom, yFrom, xTo, yTo)
{
	var p = new Parallel();
	var prop = document.getElementById("d"+i);
	p.onMotionFinished = function()
	{
		tweenCounter++;
		//console.log("Motion finished" + tweenCounter+"  "+itemsInViewArray.length)
		if(tweenCounter == itemsInViewArray.length)
		{
			console.log("Done now" +operation);
			tweenCounter = 0;
			if(operation == "add")
			{
				//console.log("fading in");
				//addedItems = changedItems;
				fadeIn();
			}
			else
			{
				//fadeOut(outOfView, 0);
			}
			changedItems = new Array();

		}
	}
	tween = new Tween(prop.style, "left", Tween.regularEaseIn, xFrom, xTo, 0.5, "px");
	p.addChild(tween);
	tween = new Tween(prop.style, "top", Tween.regularEaseIn, yFrom, yTo, 0.5, "px");
	p.addChild(tween);
	p.start();
}
function newFadeIn(items)
{
	
}
function doOpacityTween(items)
{
	for(var i=0; i<items; i++)
	{
			var d = document.getElementById("d"+i);
			opacityTween = new OpacityTween(d,'', 100, 0, 1);
			opacityTween.start();
	}
}
function setItemOpacity(items, alpha)
{
	for(var i=0; i<items.length; i++)
	{
		$("#d"+i).css("opacity", alpha);
	}
}
function removeItems(items)
{
	//console.log("Commission remove of "+items);
	//doOpacityTween(items);
	//changedItems = items;
	//setItemOpacity(items, 1);
	var tempArray = itemsInViewArray;
	for(var i =0; i<tempArray.length; i++)
	{
		for(var j =0; j<items.length; j++)
		{
			if(items[j] == tempArray[i])
			{
				//console.log("found "+tempArray[i]);
				tempArray.splice(i,1);
			}
		}
	}
	//console.log("Before layout: "+tempArray);
	layoutItems(removeDuplicateElement(tempArray));
	changedItems = new Array();
	

}
var opacityTween;
function fadeOut(items, alpha)
{
	for(var i =0; i<items.length; i++)
	{
		$("#d"+items[i]).css("opacity", alpha);
			
		
	}
	operation = "remove";
}
var opacityTweenCount = 0;
var lastChangedItems;
var opacityTweenRunning = false;
function fadeIn()
{
	
	console.log("Fading in "+changedItems);
	cb2.enabled = false;

	if(opacityTweenRunning)
	{
		//setItemOpacity(changedItems, 1);
	}
	if(lastChangedItems == changedItems)
	{
		return;
	}
	lastChangedItems = changedItems;
	addedItems = changedItems;
	for(var i =0; i<addedItems.length; i++)
	{
		console.log("Go for it");
		$("#d"+addedItems[i]).css("opacity", 1);
		var d = document.getElementById("d"+addedItems[i]);
		opacityTween = new OpacityTween(d,'', 0, 100, 0.5);
		opacityTweenRunning = true;
		opacityTween.onMotionFinished = function()
		{   
			opacityTweenCount++;
			if(opacityTweenCount == addedItems.length)
			{
					cb2.enabled = true;
					opacityTweenRunning = false;
					//setItemOpacity(addedItems, 1);

			}
			//console.log("Boom");
		}
		opacityTween.start();
		
	}

	changedItems = new Array();

}
var addedItems = new Array();
function addItems(items)
{
	console.log("Adding back  "+items+" -----> "+itemsInViewArray);
	addedItems = items;
	//console.log("---> "+createItemsToRemove(itemsInViewArray,items));
	changedItems = items;
	var tempArray = itemsInViewArray;
	for(var i=0; i<items.length; i++)
	{
		var item = items[i];
		for(var j =0 ;j<tempArray.length; j++)
		{
			
			if(tempArray[j] > item)
			{
				//console.log(tempArray[j]+" > "+item);
				var a = tempArray.splice(j, tempArray.length);
				tempArray.push(item);
				for(var x=0; x<a.length; x++)
				{
					tempArray.push(a[x]);
					
				}
				//console.log("hello: "+tempArray);
				break;
			}
			else
			{
				//console.log("I am not working with: "+tempArray[j]);
			}
		}
	}
	var lastItem = tempArray[tempArray.length-1];
	//console.log("Last Item: "+lastItem+ " "+itemsArray.length);
	if(lastItem < itemsArray.length)
	{
		for(var i = lastItem; i<itemsArray.length; i++)
		{
			tempArray.push(i);
		}
	}
	//addedItems = tempArray;
	operation = "add"
	console.log("Before adding "+tempArray);
	layoutItems(tempArray);
	//layoutItems(items);
}
function compareAndAdd(items)
{
	//console.log("To Add back "+changedItems);
	//console.log("Currently in deee "+itemsInViewArray);
	for(var i=0; i<itemsInViewArray.length; i++)
	{
		//items.push(itemsInViewArray[i]);
	}
	//console.log("Before add is called: "+changedItems);
	addItems(items);
}
var removedTribandItems;
function turnOnTriband(items)
{
	////("Triband items "+items);
	var itemsInViewCopy = itemsInViewArray;
	//console.log("Currently in display "+itemsInViewArray);
	var tempArray = new Array();
	for(var i=0; i<items.length; i++)
	{
		for(var j=0; j<itemsArray.length; j++)
		{
			//console.log("Found: "+items[i]);
			tempArray.push(items[i]);
			break;
		}
	}
	//console.log("temo arra "+tempArray);
	var toRemove = createItemsToRemove(itemsInViewCopy, tempArray);
	//console.log("To Remove: "+createItemsToRemove(itemsInViewCopy, tempArray));
	fadeOut(toRemove, 0);
	tribandFilteredItems = toRemove;
	changedItems = toRemove;
	removeItems(toRemove);
}
function turnOffTriband()
{
	//console.log("Adding back: "+tribandFilteredItems);
	addItems(tribandFilteredItems);
	addedItems = tribandFilteredItems;
	//changedItems = tribandFilteredItems;

	//changedItems = [];
}
function createItemsToRemove(source, toremove)
{
	var items = new Array();

	items = jQuery.grep(source,function (item)
	{
    	return jQuery.inArray(item, toremove) < 0;
	});
	return items;
}
var tribandChecked = false;
function onTribandChange()
{
	if(!tribandChecked)
	{
		tribandChecked = true;
		turnOnTriband([0,2,3,5,11])
	}
	else
	{
		tribandChecked = false;
		turnOffTriband()
	}
}
function moveLeft()
{
	$("#holder").removeClass("moveRight");
	$("#holder").addClass("moveLeft");
	$("#header2").removeClass("moveRight");
	$("#header2").addClass("moveLeft");
}
function moveRight()
{
	$("#holder").removeClass("moveLeft");
	$("#holder").addClass("moveRight");
	$("#header2").removeClass("moveLeft");
	$("#header2").addClass("moveRight");

}
function doSelection(event)
{
	var value = selbox.value;
	if(value == "All")
	{
		addItems(itemsArray);
		//addedItems = itemsArray;
	}
	else if(value == "2000")
	{
		turnOnTriband([2,4,5,8,11,15,18]);
	}
	else if(value == "3000")
	{
		//turnOnTriband([10,12,14,16]);
	}
}
var persistedArray = new Array();
var isPersisted = false;
function doCompare()
{
	console.log(compareItemList);
	if(!isPersisted)
	{
		isPersisted = true;
		persistedArray = new Array();
		for(var i =0; i< itemsInViewArray.length; i++)
		{
			persistedArray.push(itemsInViewArray[i]);
		}
		
	}
	if(compareItemList.length > 0)
	{
		console.log("triband called");
		turnOnTriband(compareItemList);
	}
	else
	{
		console.log("normal add called");
		console.log("persisted "+persistedArray);
		addItems(persistedArray);
		isPersisted = false;

	}
}